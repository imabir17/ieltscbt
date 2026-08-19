import { db } from './db';
import { IRepository, User, Plan, Center, CenterStaff, Test, TestModule, Attempt } from '../repo';
import { randomUUID } from 'crypto';

export class LocalRepository implements IRepository {
  async getUserByEmail(email: string): Promise<User | null> {
    const stmt = db.prepare('SELECT * FROM users WHERE email = ?');
    return (stmt.get(email) as User) || null;
  }

  async getUserById(id: string): Promise<User | null> {
    const stmt = db.prepare('SELECT * FROM users WHERE id = ?');
    return (stmt.get(id) as User) || null;
  }

  async createUser(user: Omit<User, 'id' | 'created_at'>): Promise<User> {
    const id = randomUUID();
    const stmt = db.prepare(`
      INSERT INTO users (id, email, password_hash, account_type)
      VALUES (?, ?, ?, ?)
      RETURNING *
    `);
    return stmt.get(id, user.email, user.password_hash, user.account_type) as User;
  }

  async createStudent(user: Omit<User, 'id' | 'created_at'>): Promise<User> {
    const id = randomUUID();
    const transaction = db.transaction(() => {
      const stmtUser = db.prepare(`
        INSERT INTO users (id, email, password_hash, account_type)
        VALUES (?, ?, ?, 'student')
        RETURNING *
      `);
      const createdUser = stmtUser.get(id, user.email, user.password_hash) as User;

      const stmtCredits = db.prepare(`
        INSERT INTO student_credits (user_id, free_remaining, paid_remaining)
        VALUES (?, 3, 0)
      `);
      stmtCredits.run(id);

      const stmtTransaction = db.prepare(`
        INSERT INTO credit_transactions (id, user_id, delta, reason)
        VALUES (?, ?, 3, 'signup_bonus')
      `);
      stmtTransaction.run(randomUUID(), id);

      return createdUser;
    });

    return transaction();
  }

  async getCenterStaffByUserId(userId: string): Promise<CenterStaff | null> {
    const stmt = db.prepare('SELECT * FROM center_staff WHERE user_id = ?');
    return (stmt.get(userId) as CenterStaff) || null;
  }

  async getPlans(): Promise<Plan[]> {
    const stmt = db.prepare('SELECT * FROM plans');
    return stmt.all() as Plan[];
  }

  async getPlanById(id: string): Promise<Plan | null> {
    const stmt = db.prepare('SELECT * FROM plans WHERE id = ?');
    return (stmt.get(id) as Plan) || null;
  }

  async createPlan(plan: Omit<Plan, 'id'>): Promise<Plan> {
    const id = randomUUID();
    const stmt = db.prepare(`
      INSERT INTO plans (id, name, monthly_exam_quota, price, overage_fee_per_exam, features)
      VALUES (?, ?, ?, ?, ?, ?)
      RETURNING *
    `);
    return stmt.get(
      id, 
      plan.name, 
      plan.monthly_exam_quota, 
      plan.price, 
      plan.overage_fee_per_exam, 
      plan.features
    ) as Plan;
  }

  async updatePlan(id: string, plan: Partial<Plan>): Promise<Plan | null> {
    const existing = await this.getPlanById(id);
    if (!existing) return null;

    const merged = { ...existing, ...plan };
    const stmt = db.prepare(`
      UPDATE plans 
      SET name = ?, monthly_exam_quota = ?, price = ?, overage_fee_per_exam = ?, features = ?
      WHERE id = ?
      RETURNING *
    `);
    return stmt.get(
      merged.name,
      merged.monthly_exam_quota,
      merged.price,
      merged.overage_fee_per_exam,
      merged.features,
      id
    ) as Plan;
  }

  async deletePlan(id: string): Promise<boolean> {
    const stmt = db.prepare('DELETE FROM plans WHERE id = ?');
    const info = stmt.run(id);
    return info.changes > 0;
  }

  async getCenters(): Promise<(Center & { plan_name: string; admin_email?: string })[]> {
    const stmt = db.prepare(`
      SELECT 
        c.*, 
        p.name as plan_name,
        (SELECT u.email FROM center_staff cs JOIN users u ON cs.user_id = u.id WHERE cs.center_id = c.id AND cs.role = 'admin' LIMIT 1) as admin_email
      FROM centers c
      JOIN plans p ON c.plan_id = p.id
      ORDER BY c.created_at DESC
    `);
    return stmt.all() as any[];
  }

  async createCenter(center: Omit<Center, 'id' | 'created_at'>): Promise<Center> {
    const id = randomUUID();
    const stmt = db.prepare(`
      INSERT INTO centers (id, name, plan_id, status, created_by)
      VALUES (?, ?, ?, ?, ?)
      RETURNING *
    `);
    return stmt.get(id, center.name, center.plan_id, center.status, center.created_by) as Center;
  }

  async getCenterById(id: string): Promise<Center | null> {
    const stmt = db.prepare('SELECT * FROM centers WHERE id = ?');
    return (stmt.get(id) as Center) || null;
  }

  async provisionCenter(
    centerName: string, 
    planId: string, 
    adminEmail: string, 
    adminPasswordHash: string,
    superadminId: string
  ): Promise<Center> {
    const provision = db.transaction(() => {
      const adminId = randomUUID();
      const centerId = randomUUID();
      const staffId = randomUUID();

      // 1. Create User
      db.prepare(`
        INSERT INTO users (id, email, password_hash, account_type) 
        VALUES (?, ?, ?, 'center_staff')
      `).run(adminId, adminEmail, adminPasswordHash);

      // 2. Create Center
      const centerStmt = db.prepare(`
        INSERT INTO centers (id, name, plan_id, status, created_by)
        VALUES (?, ?, ?, 'active', ?)
        RETURNING *
      `);
      const center = centerStmt.get(centerId, centerName, planId, superadminId) as Center;

      // 3. Create Staff Role
      db.prepare(`
        INSERT INTO center_staff (id, center_id, user_id, role, permissions)
        VALUES (?, ?, ?, 'admin', '[]')
      `).run(staffId, centerId, adminId);

      return center;
    });

    return provision();
  }

  // Tests & Question Bank
  async getGlobalTests(): Promise<(Test & { module_type: string | null })[]> {
    const stmt = db.prepare(`
      SELECT t.*, tm.module_type
      FROM tests t
      LEFT JOIN test_modules tm ON tm.test_id = t.id
      WHERE t.owner_center_id IS NULL
      ORDER BY tm.module_type ASC, t.created_at DESC
    `);
    return (stmt.all() as any[]).map(t => ({ ...t }));
  }

  async getTestById(id: string): Promise<Test | null> {
    const stmt = db.prepare('SELECT * FROM tests WHERE id = ?');
    const row = stmt.get(id) as any;
    return row ? { ...row } : null;
  }

  async getTestModulesByTestId(testId: string): Promise<TestModule[]> {
    const stmt = db.prepare('SELECT * FROM test_modules WHERE test_id = ?');
    return (stmt.all(testId) as any[]).map(r => ({ ...r }));
  }

  async createTest(test: Omit<Test, 'id' | 'created_at'>): Promise<Test> {
    const id = randomUUID();
    const stmt = db.prepare(`
      INSERT INTO tests (id, owner_center_id, name, type, status)
      VALUES (?, ?, ?, ?, ?)
      RETURNING *
    `);
    return stmt.get(id, test.owner_center_id, test.name, test.type, test.status) as Test;
  }

  async createTestModule(testModule: Omit<TestModule, 'id'>): Promise<TestModule> {
    const id = randomUUID();
    const stmt = db.prepare(`
      INSERT INTO test_modules (id, test_id, module_type, config, questions)
      VALUES (?, ?, ?, ?, ?)
      RETURNING *
    `);
    return stmt.get(id, testModule.test_id, testModule.module_type, testModule.config, testModule.questions) as TestModule;
  }

  async deleteTestModulesByTestId(testId: string): Promise<void> {
    db.prepare('DELETE FROM test_modules WHERE test_id = ?').run(testId);
  }

  async deleteTest(testId: string): Promise<void> {
    db.transaction(() => {
      db.prepare('DELETE FROM test_modules WHERE test_id = ?').run(testId);
      db.prepare('DELETE FROM tests WHERE id = ?').run(testId);
    })();
  }

  // Scoring
  async getSelfServeSubmissions(): Promise<(Attempt & { student_email: string, test_name: string })[]> {
    const stmt = db.prepare(`
      SELECT 
        a.*,
        u.email as student_email,
        t.name as test_name
      FROM attempts a
      JOIN users u ON a.student_id = u.id
      JOIN tests t ON a.test_id = t.id
      WHERE a.source = 'self_serve' AND a.status IN ('submitted', 'grading', 'graded')
      ORDER BY a.submitted_at ASC
    `);
    return stmt.all() as any[];
  }
}

export const repo = new LocalRepository();
