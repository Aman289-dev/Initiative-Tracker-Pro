import { useEffect, useMemo, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  fetchInitiatives,
  deleteInitiative,
  setFilters,
  clearFilters,
} from '@/store/slices/initiativesSlice';
import type { Initiative, InitiativeStatus, InitiativePriority } from '@/types';
import { Card, Button, Input, Spinner, EmptyState } from '@/components/ui';
import { inputClass } from '@/components/ui/Input';
import { cn } from '@/utils/cn';
import {
  Plus,
  Search,
  Filter,
  X,
  Pencil,
  Trash2,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Clock,
} from 'lucide-react';
import InitiativeModal from '@/components/InitiativeModal';

// Status badge colors
const statusColors: Record<InitiativeStatus, string> = {
  'Not Started': 'bg-muted text-muted-foreground',
  'In Progress': 'bg-blue-100 text-blue-700',
  'At Risk': 'bg-amber-100 text-amber-700',
  'Completed': 'bg-green-100 text-green-700',
  'On Hold': 'bg-slate-100 text-slate-600',
};

// Priority badge colors
const priorityColors: Record<InitiativePriority, string> = {
  Low: 'bg-slate-100 text-slate-600',
  Medium: 'bg-blue-100 text-blue-700',
  High: 'bg-amber-100 text-amber-700',
  Critical: 'bg-red-100 text-red-700',
};

// Format date for display
function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

// Check deadline status
function getDeadlineStatus(deadline: string, status: InitiativeStatus): 'overdue' | 'soon' | 'normal' {
  if (status === 'Completed') return 'normal';

  const now = new Date();
  const deadlineDate = new Date(deadline);
  const diffDays = Math.ceil((deadlineDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

  if (diffDays < 0) return 'overdue';
  if (diffDays <= 7) return 'soon';
  return 'normal';
}

export default function Dashboard() {
  const dispatch = useAppDispatch();
  const { items, loading, filters } = useAppSelector((state) => state.initiatives);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingInitiative, setEditingInitiative] = useState<Initiative | null>(null);
  const [sortField, setSortField] = useState<'deadline' | 'priority' | 'status' | 'owner'>('deadline');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  // Fetch initiatives on mount and when filters change
  useEffect(() => {
    dispatch(fetchInitiatives(filters));
  }, [dispatch, filters]);

  // Get unique owners and categories for filter dropdowns
  const uniqueOwners = useMemo(() => {
    const owners = new Set(items.map((item) => item.owner));
    return Array.from(owners).sort();
  }, [items]);

  const uniqueCategories = useMemo(() => {
    const categories = new Set(items.filter((item) => item.category).map((item) => item.category!));
    return Array.from(categories).sort();
  }, [items]);

  // Calculate summary stats
  const stats = useMemo(() => {
    const total = items.length;
    const inProgress = items.filter((i) => i.status === 'In Progress').length;
    const atRisk = items.filter((i) => i.status === 'At Risk').length;
    const completed = items.filter((i) => i.status === 'Completed').length;
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

    return { total, inProgress, atRisk, completed, completionRate };
  }, [items]);

  // Sort initiatives
  const sortedItems = useMemo(() => {
    const priorityOrder: Record<InitiativePriority, number> = {
      Critical: 4,
      High: 3,
      Medium: 2,
      Low: 1,
    };

    const statusOrder: Record<InitiativeStatus, number> = {
      'At Risk': 5,
      'In Progress': 4,
      'Not Started': 3,
      'On Hold': 2,
      'Completed': 1,
    };

    return [...items].sort((a, b) => {
      let comparison = 0;

      switch (sortField) {
        case 'deadline':
          comparison = new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
          break;
        case 'priority':
          comparison = priorityOrder[a.priority] - priorityOrder[b.priority];
          break;
        case 'status':
          comparison = statusOrder[a.status] - statusOrder[b.status];
          break;
        case 'owner':
          comparison = a.owner.localeCompare(b.owner);
          break;
      }

      return sortDirection === 'asc' ? comparison : -comparison;
    });
  }, [items, sortField, sortDirection]);

  const handleSort = (field: typeof sortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleEdit = (initiative: Initiative) => {
    setEditingInitiative(initiative);
    setModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this initiative?')) {
      await dispatch(deleteInitiative(id));
    }
  };

  const handleCreateNew = () => {
    setEditingInitiative(null);
    setModalOpen(true);
  };

  const handleFilterChange = (key: keyof typeof filters, value: string) => {
    dispatch(setFilters({ ...filters, [key]: value || undefined }));
  };

  const handleClearFilters = () => {
    dispatch(clearFilters());
  };

  const hasActiveFilters = filters.status || filters.owner || filters.category || filters.search;

  return (
    <div
      className="min-h-screen bg-background"
      data-icod-id="src_pages_dashboard_tsx_3640">
      {/* Header */}
      <header
        className="border-b border-border bg-card"
        data-icod-id="src_pages_dashboard_tsx_cc0a">
        <div
          className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8"
          data-icod-id="src_pages_dashboard_tsx_5b27">
          <div
            className="flex items-center justify-between"
            data-icod-id="src_pages_dashboard_tsx_2928">
            <div
              className="flex items-center gap-3"
              data-icod-id="src_pages_dashboard_tsx_411e">
              <img
                src="https://images.unsplash.com/photo-1474511320723-9a56873867b5?w=200&h=200&fit=crop&crop=face"
                alt="Team mascot - friendly fox"
                className="h-16 w-16 rounded-full object-cover shadow-md ring-2 ring-primary/20"
                data-icod-id="src_pages_dashboard_tsx_122f" />
              <div
                className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary"
                data-icod-id="src_pages_dashboard_tsx_b611">
                <TrendingUp
                  className="h-6 w-6 text-primary-foreground"
                  data-icod-id="src_pages_dashboard_tsx_65f5" />
              </div>
              <div data-icod-id="src_pages_dashboard_tsx_f15c">
                <h1
                  className="text-2xl font-bold text-foreground"
                  data-icod-id="src_pages_dashboard_tsx_496e">Initiative Tracker</h1>
                <p
                  className="text-sm text-muted-foreground"
                  data-icod-id="src_pages_dashboard_tsx_475e">Manage and track team initiatives</p>
              </div>
            </div>
            <Button onClick={handleCreateNew} data-icod-id="src_pages_dashboard_tsx_4178">
              <Plus className="h-4 w-4" data-icod-id="src_pages_dashboard_tsx_9645" />
              New Initiative
            </Button>
          </div>
        </div>
      </header>
      <main
        className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8"
        data-icod-id="src_pages_dashboard_tsx_eaed">
        {/* Summary Stats */}
        <div
          className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
          data-icod-id="src_pages_dashboard_tsx_4494">
          <Card
            className="border-l-4 border-l-primary p-4"
            data-icod-id="src_pages_dashboard_tsx_85e9">
            <div
              className="text-sm font-medium text-muted-foreground"
              data-icod-id="src_pages_dashboard_tsx_dbaa">Total Initiatives</div>
            <div
              className="mt-1 text-3xl font-bold text-foreground"
              data-icod-id="src_pages_dashboard_tsx_94af">{stats.total}</div>
          </Card>
          <Card
            className="border-l-4 border-l-blue-500 p-4"
            data-icod-id="src_pages_dashboard_tsx_6613">
            <div
              className="text-sm font-medium text-muted-foreground"
              data-icod-id="src_pages_dashboard_tsx_073b">In Progress</div>
            <div
              className="mt-1 text-3xl font-bold text-foreground"
              data-icod-id="src_pages_dashboard_tsx_e0bf">{stats.inProgress}</div>
          </Card>
          <Card
            className="border-l-4 border-l-amber-500 p-4"
            data-icod-id="src_pages_dashboard_tsx_2e0b">
            <div
              className="text-sm font-medium text-muted-foreground"
              data-icod-id="src_pages_dashboard_tsx_fd4f">At Risk</div>
            <div
              className="mt-1 flex items-baseline gap-2"
              data-icod-id="src_pages_dashboard_tsx_c7b1">
              <span
                className="text-3xl font-bold text-amber-600"
                data-icod-id="src_pages_dashboard_tsx_ddee">{stats.atRisk}</span>
              {stats.atRisk > 0 && (
                <AlertTriangle
                  className="h-4 w-4 text-amber-600"
                  data-icod-id="src_pages_dashboard_tsx_15df" />
              )}
            </div>
          </Card>
          <Card
            className="border-l-4 border-l-green-500 p-4"
            data-icod-id="src_pages_dashboard_tsx_a34f">
            <div
              className="text-sm font-medium text-muted-foreground"
              data-icod-id="src_pages_dashboard_tsx_4db5">Completed</div>
            <div
              className="mt-1 flex items-baseline gap-2"
              data-icod-id="src_pages_dashboard_tsx_2679">
              <span
                className="text-3xl font-bold text-foreground"
                data-icod-id="src_pages_dashboard_tsx_546b">{stats.completed}</span>
              <span
                className="text-sm text-muted-foreground"
                data-icod-id="src_pages_dashboard_tsx_09ec">({stats.completionRate}%)</span>
            </div>
          </Card>
        </div>

        {/* Filters Bar */}
        <Card className="mb-6 p-4" data-icod-id="src_pages_dashboard_tsx_e70a">
          <div
            className="flex flex-wrap items-center gap-4"
            data-icod-id="src_pages_dashboard_tsx_be68">
            <div
              className="relative flex-1 min-w-[200px]"
              data-icod-id="src_pages_dashboard_tsx_fa9e">
              <Search
                className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                data-icod-id="src_pages_dashboard_tsx_0901" />
              <Input
                placeholder="Search initiatives..."
                value={filters.search || ''}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="pl-9"
                data-icod-id="src_pages_dashboard_tsx_d032" />
            </div>

            <select
              className={inputClass('w-auto min-w-[140px]')}
              value={filters.status || ''}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              data-icod-id="src_pages_dashboard_tsx_c902">
              <option value="" data-icod-id="src_pages_dashboard_tsx_7e77">All Statuses</option>
              <option value="Not Started" data-icod-id="src_pages_dashboard_tsx_2656">Not Started</option>
              <option value="In Progress" data-icod-id="src_pages_dashboard_tsx_d96d">In Progress</option>
              <option value="At Risk" data-icod-id="src_pages_dashboard_tsx_3630">At Risk</option>
              <option value="Completed" data-icod-id="src_pages_dashboard_tsx_12c2">Completed</option>
              <option value="On Hold" data-icod-id="src_pages_dashboard_tsx_99c4">On Hold</option>
            </select>

            <select
              className={inputClass('w-auto min-w-[140px]')}
              value={filters.owner || ''}
              onChange={(e) => handleFilterChange('owner', e.target.value)}
              data-icod-id="src_pages_dashboard_tsx_fc40">
              <option value="" data-icod-id="src_pages_dashboard_tsx_2994">All Owners</option>
              {uniqueOwners.map((owner) => (
                <option
                  key={owner}
                  value={owner}
                  data-icod-id={`src_pages_dashboard_tsx_e5b1_${owner}`}>
                  {owner}
                </option>
              ))}
            </select>

            <select
              className={inputClass('w-auto min-w-[140px]')}
              value={filters.category || ''}
              onChange={(e) => handleFilterChange('category', e.target.value)}
              data-icod-id="src_pages_dashboard_tsx_b442">
              <option value="" data-icod-id="src_pages_dashboard_tsx_01fc">All Categories</option>
              {uniqueCategories.map((category) => (
                <option
                  key={category}
                  value={category}
                  data-icod-id={`src_pages_dashboard_tsx_788e_${category}`}>
                  {category}
                </option>
              ))}
            </select>

            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearFilters}
                data-icod-id="src_pages_dashboard_tsx_7ca0">
                <X className="h-4 w-4" data-icod-id="src_pages_dashboard_tsx_7219" />
                Clear
              </Button>
            )}
          </div>
        </Card>

        {/* Initiatives Table */}
        <Card className="overflow-hidden" data-icod-id="src_pages_dashboard_tsx_5bcd">
          {loading ? (
            <div
              className="flex items-center justify-center py-20"
              data-icod-id="src_pages_dashboard_tsx_5a3c">
              <Spinner size="lg" data-icod-id="src_pages_dashboard_tsx_0592" />
            </div>
          ) : sortedItems.length === 0 ? (
            <EmptyState
              icon={Filter}
              title="No initiatives found"
              description={
                hasActiveFilters
                  ? 'Try adjusting your filters or search terms'
                  : 'Get started by creating your first initiative'
              }
              action={
                !hasActiveFilters ? (
                  <Button onClick={handleCreateNew} data-icod-id="src_pages_dashboard_tsx_1972">
                    <Plus className="h-4 w-4" data-icod-id="src_pages_dashboard_tsx_7d3b" />
                    Create Initiative
                  </Button>
                ) : undefined
              }
              data-icod-id="src_pages_dashboard_tsx_24a6" />
          ) : (
            <div className="overflow-x-auto" data-icod-id="src_pages_dashboard_tsx_04f0">
              <table className="w-full" data-icod-id="src_pages_dashboard_tsx_9a87">
                <thead
                  className="sticky top-0 z-10 border-b border-border bg-muted/50"
                  data-icod-id="src_pages_dashboard_tsx_105e">
                  <tr data-icod-id="src_pages_dashboard_tsx_e112">
                    <th
                      className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground"
                      data-icod-id="src_pages_dashboard_tsx_df19">
                      #
                    </th>
                    <th
                      className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground"
                      data-icod-id="src_pages_dashboard_tsx_b23c">
                      Title
                    </th>
                    <th
                      className="cursor-pointer px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground hover:text-foreground"
                      onClick={() => handleSort('owner')}
                      data-icod-id="src_pages_dashboard_tsx_e71f">
                      Owner {sortField === 'owner' && (sortDirection === 'asc' ? '↑' : '↓')}
                    </th>
                    <th
                      className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground"
                      data-icod-id="src_pages_dashboard_tsx_eb71">
                      Category
                    </th>
                    <th
                      className="cursor-pointer px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground hover:text-foreground"
                      onClick={() => handleSort('priority')}
                      data-icod-id="src_pages_dashboard_tsx_2bd2">
                      Priority {sortField === 'priority' && (sortDirection === 'asc' ? '↑' : '↓')}
                    </th>
                    <th
                      className="cursor-pointer px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground hover:text-foreground"
                      onClick={() => handleSort('status')}
                      data-icod-id="src_pages_dashboard_tsx_8edd">
                      Status {sortField === 'status' && (sortDirection === 'asc' ? '↑' : '↓')}
                    </th>
                    <th
                      className="cursor-pointer px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground hover:text-foreground"
                      onClick={() => handleSort('deadline')}
                      data-icod-id="src_pages_dashboard_tsx_ec90">
                      Deadline {sortField === 'deadline' && (sortDirection === 'asc' ? '↑' : '↓')}
                    </th>
                    <th
                      className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground"
                      data-icod-id="src_pages_dashboard_tsx_ed20">
                      Progress
                    </th>
                    <th
                      className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground"
                      data-icod-id="src_pages_dashboard_tsx_1db2">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody
                  className="divide-y divide-border"
                  data-icod-id="src_pages_dashboard_tsx_6553">
                  {sortedItems.map((initiative, index) => {
                    const deadlineStatus = getDeadlineStatus(initiative.deadline, initiative.status);

                    return (
                      <tr
                        key={initiative._id}
                        className={cn(
                          'transition-colors hover:bg-accent/50',
                          index % 2 === 0 ? 'bg-card' : 'bg-muted/30'
                        )}
                        data-icod-id={`src_pages_dashboard_tsx_dc05_${initiative._id}`}>
                        <td
                          className="whitespace-nowrap px-4 py-3 text-sm text-muted-foreground"
                          data-icod-id={`src_pages_dashboard_tsx_47a1_${initiative._id}`}>
                          {index + 1}
                        </td>
                        <td
                          className="px-4 py-3"
                          data-icod-id={`src_pages_dashboard_tsx_d2ae_${initiative._id}`}>
                          <div
                            className="font-medium text-foreground"
                            data-icod-id={`src_pages_dashboard_tsx_9c52_${initiative._id}`}>{initiative.title}</div>
                          {initiative.description && (
                            <div
                              className="mt-0.5 line-clamp-1 text-xs text-muted-foreground"
                              data-icod-id={`src_pages_dashboard_tsx_ec15_${initiative._id}`}>
                              {initiative.description}
                            </div>
                          )}
                        </td>
                        <td
                          className="whitespace-nowrap px-4 py-3 text-sm text-foreground"
                          data-icod-id={`src_pages_dashboard_tsx_c5c3_${initiative._id}`}>
                          {initiative.owner}
                        </td>
                        <td
                          className="whitespace-nowrap px-4 py-3 text-sm text-muted-foreground"
                          data-icod-id={`src_pages_dashboard_tsx_b9b4_${initiative._id}`}>
                          {initiative.category || '—'}
                        </td>
                        <td
                          className="whitespace-nowrap px-4 py-3"
                          data-icod-id={`src_pages_dashboard_tsx_9e26_${initiative._id}`}>
                          <span
                            className={cn(
                              'inline-flex items-center rounded px-2 py-1 text-xs font-medium',
                              priorityColors[initiative.priority]
                            )}
                            data-icod-id={`src_pages_dashboard_tsx_399c_${initiative._id}`}>
                            {initiative.priority}
                          </span>
                        </td>
                        <td
                          className="whitespace-nowrap px-4 py-3"
                          data-icod-id={`src_pages_dashboard_tsx_6927_${initiative._id}`}>
                          <span
                            className={cn(
                              'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
                              statusColors[initiative.status]
                            )}
                            data-icod-id={`src_pages_dashboard_tsx_0e20_${initiative._id}`}>
                            {initiative.status}
                          </span>
                        </td>
                        <td
                          className="whitespace-nowrap px-4 py-3"
                          data-icod-id={`src_pages_dashboard_tsx_e286_${initiative._id}`}>
                          <div
                            className={cn(
                              'flex items-center gap-1.5 text-sm',
                              deadlineStatus === 'overdue' && 'font-semibold text-red-600',
                              deadlineStatus === 'soon' && 'font-semibold text-amber-600',
                              deadlineStatus === 'normal' && 'text-foreground'
                            )}
                            data-icod-id={`src_pages_dashboard_tsx_e4d0_${initiative._id}`}>
                            {deadlineStatus === 'overdue' && (
                              <AlertTriangle
                                className="h-3.5 w-3.5"
                                data-icod-id={`src_pages_dashboard_tsx_50c5_${initiative._id}`} />
                            )}
                            {deadlineStatus === 'soon' && <Clock
                              className="h-3.5 w-3.5"
                              data-icod-id={`src_pages_dashboard_tsx_9b83_${initiative._id}`} />}
                            {formatDate(initiative.deadline)}
                          </div>
                        </td>
                        <td
                          className="whitespace-nowrap px-4 py-3"
                          data-icod-id={`src_pages_dashboard_tsx_d8e9_${initiative._id}`}>
                          <div
                            className="flex items-center gap-2"
                            data-icod-id={`src_pages_dashboard_tsx_e354_${initiative._id}`}>
                            <div
                              className="h-1.5 w-24 overflow-hidden rounded-full bg-muted"
                              data-icod-id={`src_pages_dashboard_tsx_c178_${initiative._id}`}>
                              <div
                                className="h-full rounded-full bg-primary transition-all"
                                style={{ width: `${initiative.progress}%` }}
                                data-icod-id={`src_pages_dashboard_tsx_ec0f_${initiative._id}`} />
                            </div>
                            <span
                              className="text-xs text-muted-foreground"
                              data-icod-id={`src_pages_dashboard_tsx_a0db_${initiative._id}`}>{initiative.progress}%</span>
                          </div>
                        </td>
                        <td
                          className="whitespace-nowrap px-4 py-3 text-right"
                          data-icod-id={`src_pages_dashboard_tsx_ada8_${initiative._id}`}>
                          <div
                            className="flex items-center justify-end gap-1"
                            data-icod-id={`src_pages_dashboard_tsx_5c5c_${initiative._id}`}>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleEdit(initiative)}
                              aria-label="Edit"
                              data-icod-id={`src_pages_dashboard_tsx_1507_${initiative._id}`}>
                              <Pencil
                                className="h-4 w-4"
                                data-icod-id={`src_pages_dashboard_tsx_354b_${initiative._id}`} />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDelete(initiative._id)}
                              aria-label="Delete"
                              className="text-destructive hover:text-destructive"
                              data-icod-id={`src_pages_dashboard_tsx_7c00_${initiative._id}`}>
                              <Trash2
                                className="h-4 w-4"
                                data-icod-id={`src_pages_dashboard_tsx_19f9_${initiative._id}`} />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </main>
      {/* Add/Edit Modal */}
      <InitiativeModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        initiative={editingInitiative}
        data-icod-id="src_pages_dashboard_tsx_cceb" />
    </div>
  );
}
