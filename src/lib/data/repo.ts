export interface User {
  id: string;
  email: string;
  password_hash: string;
  account_type: 'student' | 'center_staff' | 'superadmin';
  created_at: string;
}

export interface Plan {
  id: string;
  name: string;
  monthly_exam_quota: number;
  price: number;
  overage_fee_per_exam: number | null;
  features: string; // JSON string
}

export interface Center {
  id: string;
  name: string;
  plan_id: string;
  status: 'active' | 'suspended';
  created_by: string;
  created_at: string;
}

export interface CenterStaff {
  id: string;
  center_id: string;
  user_id: string;
  role: 'admin' | 'manager' | 'test_creator' | 'evaluator';
  permissions: string;
}

export interface Test {
  id: string;
  owner_center_id: string | null;
  name: string;
  type: 'Academic' | 'General';
  status: 'draft' | 'published';
  created_at: string;
}

export interface TestModule {
  id: string;
  test_id: string;
  module_type: 'listening' | 'reading' | 'writing';
  config: string;
  questions: string;
}

export interface Attempt {
  id: string;
  student_id: string;
  source: 'self_serve' | 'center_exam';
  exam_enrollment_id: string | null;
  test_id: string;
  status: 'not_started' | 'in_progress' | 'submitted' | 'grading' | 'graded' | 'published';
  started_at: string | null;
  submitted_at: string | null;
  answers: string | null;
}

export interface IRepository {
  // Users
  getUserByEmail(email: string): Promise<User | null>;
  getUserById(id: string): Promise<User | null>;
  createUser(user: Omit<User, 'id' | 'created_at'>): Promise<User>;
  createStudent(user: Omit<User, 'id' | 'created_at'>): Promise<User>;
  getCenterStaffByUserId(userId: string): Promise<CenterStaff | null>;

  // Plans
  getPlans(): Promise<Plan[]>;
  getPlanById(id: string): Promise<Plan | null>;
  createPlan(plan: Omit<Plan, 'id'>): Promise<Plan>;
  updatePlan(id: string, plan: Partial<Plan>): Promise<Plan | null>;
  deletePlan(id: string): Promise<boolean>;
  
  // Centers
  getCenters(): Promise<(Center & { plan_name: string; admin_email?: string })[]>;
  getCenterById(id: string): Promise<Center | null>;
  createCenter(center: Omit<Center, 'id' | 'created_at'>): Promise<Center>;
  provisionCenter(
    centerName: string, 
    planId: string, 
    adminEmail: string, 
    adminPasswordHash: string,
    superadminId: string
  ): Promise<Center>;

  // Tests & Question Bank
  getGlobalTests(): Promise<Test[]>;
  getTestById(id: string): Promise<Test | null>;
  getTestModulesByTestId(testId: string): Promise<TestModule[]>;
  createTest(test: Omit<Test, 'id' | 'created_at'>): Promise<Test>;
  createTestModule(testModule: Omit<TestModule, 'id'>): Promise<TestModule>;
  deleteTestModulesByTestId(testId: string): Promise<void>;

  // Scoring
  getSelfServeSubmissions(): Promise<(Attempt & { student_email: string, test_name: string })[]>;
}

// We will export a concrete instance of IRepository below.
// For Phase 1, it will be the local SQLite repository.
