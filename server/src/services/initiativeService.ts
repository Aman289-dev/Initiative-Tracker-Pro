import Initiative, { IInitiative } from '../models/Initiative';

export interface InitiativeFilters {
  status?: string;
  owner?: string;
  category?: string;
  search?: string;
}

export interface CreateInitiativeData {
  title: string;
  description?: string;
  owner: string;
  status?: 'Not Started' | 'In Progress' | 'At Risk' | 'Completed' | 'On Hold';
  priority?: 'Low' | 'Medium' | 'High' | 'Critical';
  deadline: Date | string;
  category?: string;
  tags?: string[];
  progress?: number;
}

export interface UpdateInitiativeData extends Partial<CreateInitiativeData> {}

export async function getAllInitiatives(filters: InitiativeFilters = {}): Promise<IInitiative[]> {
  const query: Record<string, unknown> = {};

  if (filters.status) {
    query.status = filters.status;
  }

  if (filters.owner) {
    query.owner = filters.owner;
  }

  if (filters.category) {
    query.category = filters.category;
  }

  if (filters.search) {
    query.$or = [
      { title: { $regex: filters.search, $options: 'i' } },
      { description: { $regex: filters.search, $options: 'i' } },
      { owner: { $regex: filters.search, $options: 'i' } },
    ];
  }

  return Initiative.find(query).sort({ createdAt: -1 });
}

export async function getInitiativeById(id: string): Promise<IInitiative | null> {
  return Initiative.findById(id);
}

export async function createInitiative(data: CreateInitiativeData): Promise<IInitiative> {
  return Initiative.create(data);
}

export async function updateInitiative(
  id: string,
  data: UpdateInitiativeData
): Promise<IInitiative | null> {
  return Initiative.findByIdAndUpdate(id, data, { new: true, runValidators: true });
}

export async function deleteInitiative(id: string): Promise<IInitiative | null> {
  return Initiative.findByIdAndDelete(id);
}

export async function countByStatus(): Promise<Record<string, number>> {
  const result = await Initiative.aggregate([
    { $group: { _id: '$status', count: { $sum: 1 } } },
  ]);

  const counts: Record<string, number> = {};
  for (const item of result) {
    counts[item._id as string] = item.count;
  }
  return counts;
}

export async function seedSampleInitiatives(): Promise<void> {
  const existingCount = await Initiative.countDocuments();
  if (existingCount > 0) {
    console.log('[SEED] Initiatives already exist, skipping seed');
    return;
  }

  const sampleInitiatives: CreateInitiativeData[] = [
    {
      title: 'Q4 Product Roadmap Planning',
      description: 'Define and prioritize features for Q4 release cycle',
      owner: 'sarah.chen@company.com',
      status: 'In Progress',
      priority: 'High',
      deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
      category: 'Product',
      tags: ['roadmap', 'planning', 'q4'],
      progress: 45,
    },
    {
      title: 'Infrastructure Migration to AWS',
      description: 'Migrate legacy infrastructure to AWS cloud platform',
      owner: 'mike.johnson@company.com',
      status: 'At Risk',
      priority: 'Critical',
      deadline: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
      category: 'Engineering',
      tags: ['infrastructure', 'aws', 'migration'],
      progress: 60,
    },
    {
      title: 'Customer Onboarding Flow Redesign',
      description: 'Improve user onboarding experience based on feedback',
      owner: 'emma.wilson@company.com',
      status: 'Not Started',
      priority: 'Medium',
      deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      category: 'Product',
      tags: ['ux', 'onboarding', 'customer'],
      progress: 0,
    },
    {
      title: 'Annual Marketing Campaign',
      description: 'Execute Q4 marketing campaign across all channels',
      owner: 'david.brown@company.com',
      status: 'In Progress',
      priority: 'High',
      deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      category: 'Marketing',
      tags: ['marketing', 'campaign', 'q4'],
      progress: 35,
    },
    {
      title: 'Security Audit & Compliance',
      description: 'Conduct security audit and ensure SOC2 compliance',
      owner: 'alex.rodriguez@company.com',
      status: 'Completed',
      priority: 'Critical',
      deadline: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
      category: 'Operations',
      tags: ['security', 'compliance', 'soc2'],
      progress: 100,
    },
    {
      title: 'Mobile App Performance Optimization',
      description: 'Reduce app load time and improve responsiveness',
      owner: 'lisa.zhang@company.com',
      status: 'In Progress',
      priority: 'Medium',
      deadline: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000), // 21 days from now
      category: 'Engineering',
      tags: ['mobile', 'performance', 'optimization'],
      progress: 55,
    },
    {
      title: 'Employee Training Program Launch',
      description: 'Roll out new employee training and development program',
      owner: 'james.taylor@company.com',
      status: 'On Hold',
      priority: 'Low',
      deadline: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000), // 45 days from now
      category: 'Operations',
      tags: ['training', 'hr', 'development'],
      progress: 20,
    },
    {
      title: 'API Documentation Overhaul',
      description: 'Update and improve API documentation for developers',
      owner: 'anna.kowalski@company.com',
      status: 'Not Started',
      priority: 'Medium',
      deadline: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // 60 days from now
      category: 'Engineering',
      tags: ['documentation', 'api', 'developer-experience'],
      progress: 0,
    },
    {
      title: 'Sales Dashboard Implementation',
      description: 'Build real-time sales analytics dashboard',
      owner: 'robert.garcia@company.com',
      status: 'In Progress',
      priority: 'High',
      deadline: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), // 10 days from now
      category: 'Product',
      tags: ['analytics', 'dashboard', 'sales'],
      progress: 70,
    },
    {
      title: 'Vendor Contract Renewals',
      description: 'Review and renew contracts with key vendors',
      owner: 'maria.santos@company.com',
      status: 'At Risk',
      priority: 'Medium',
      deadline: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago (overdue)
      category: 'Operations',
      tags: ['contracts', 'vendors', 'legal'],
      progress: 40,
    },
    {
      title: 'Content Strategy Framework',
      description: 'Develop comprehensive content strategy for next year',
      owner: 'chris.anderson@company.com',
      status: 'Completed',
      priority: 'Low',
      deadline: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // 10 days ago
      category: 'Marketing',
      tags: ['content', 'strategy', 'marketing'],
      progress: 100,
    },
    {
      title: 'Database Indexing Optimization',
      description: 'Optimize database indexes for improved query performance',
      owner: 'kevin.patel@company.com',
      status: 'In Progress',
      priority: 'High',
      deadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
      category: 'Engineering',
      tags: ['database', 'performance', 'optimization'],
      progress: 80,
    },
  ];

  await Initiative.insertMany(sampleInitiatives);
  console.log(`[SEED] Created ${sampleInitiatives.length} sample initiatives`);
}
