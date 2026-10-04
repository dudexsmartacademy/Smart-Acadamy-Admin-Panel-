import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Users,
  UserPlus,
  Search,
  Filter,
  ArrowUpDown,
  MoreVertical,
  Eye,
  Edit2,
  Trash2,
  Power,
  BookOpen,
  Layers,
  CalendarCheck,
  Activity,
  SlidersHorizontal,
  X,
  CheckCircle,
  FileSpreadsheet,
} from 'lucide-react';

import { PageHeader } from '../../components/common/PageHeader';
import { Button } from '../../components/common/Button';
import { IconButton } from '../../components/common/IconButton';
import { SearchBar } from '../../components/common/SearchBar';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Avatar } from '../../components/common/Avatar';
import { Table, TableHead, TableBody, TableRow, TableHeaderCell, TableCell } from '../../components/common/Table';
import { Pagination } from '../../components/common/Pagination';
import { Drawer } from '../../components/common/Drawer';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { EmptyState } from '../../components/common/EmptyState';
import { Select } from '../../components/common/Select';
import { useToast } from '../../context/ToastContext';
import { teacherService } from '../../services/teacherService';
import { Teacher, TeacherStatus } from '../../types';
import { DEPARTMENTS, DESIGNATIONS } from '../../constants/storageKeys';

type SortField = 'fullName' | 'joiningDate' | 'attendanceRate' | 'department' | 'status';
type SortOrder = 'asc' | 'desc';

export const TeacherListPage: React.FC = () => {
  const navigate = useNavigate();
  const { success, error: toastError } = useToast();

  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [deptFilter, setDeptFilter] = useState('');
  const [designationFilter, setDesignationFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [attendanceRange, setAttendanceRange] = useState('');
  const [sortField, setSortField] = useState<SortField>('joiningDate');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Action / Confirm state
  const [targetTeacher, setTargetTeacher] = useState<Teacher | null>(null);
  const [dialogAction, setDialogAction] = useState<'delete' | 'toggleStatus' | null>(null);

  // Active action menu row
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  const loadTeachers = () => {
    teacherService.getTeachers().then(setTeachers);
  };

  useEffect(() => {
    loadTeachers();
  }, []);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  // Filter and sort computation
  const filteredTeachers = useMemo(() => {
    return teachers
      .filter((t) => {
        const q = searchQuery.toLowerCase().trim();
        const matchesSearch =
          !q ||
          t.fullName.toLowerCase().includes(q) ||
          t.teacherId.toLowerCase().includes(q) ||
          t.email.toLowerCase().includes(q) ||
          t.phone.toLowerCase().includes(q) ||
          t.department.toLowerCase().includes(q) ||
          t.primarySubject.toLowerCase().includes(q);

        const matchesDept = !deptFilter || t.department === deptFilter;
        const matchesDesignation = !designationFilter || t.designation === designationFilter;
        const matchesStatus = !statusFilter || t.status === statusFilter;

        let matchesAtt = true;
        if (attendanceRange === 'above95') {
          matchesAtt = (t.attendanceRate || 0) >= 95;
        } else if (attendanceRange === '90to95') {
          matchesAtt = (t.attendanceRate || 0) >= 90 && (t.attendanceRate || 0) < 95;
        } else if (attendanceRange === 'below90') {
          matchesAtt = (t.attendanceRate || 0) < 90;
        }

        return matchesSearch && matchesDept && matchesDesignation && matchesStatus && matchesAtt;
      })
      .sort((a, b) => {
        let valA: any = a[sortField];
        let valB: any = b[sortField];

        if (typeof valA === 'string') {
          valA = valA.toLowerCase();
          valB = (valB || '').toLowerCase();
        }

        if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
        if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
        return 0;
      });
  }, [
    teachers,
    searchQuery,
    deptFilter,
    designationFilter,
    statusFilter,
    attendanceRange,
    sortField,
    sortOrder,
  ]);

  // Paginated records
  const paginatedTeachers = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredTeachers.slice(start, start + pageSize);
  }, [filteredTeachers, currentPage, pageSize]);

  const hasActiveFilters = deptFilter || designationFilter || statusFilter || attendanceRange;

  const clearFilters = () => {
    setDeptFilter('');
    setDesignationFilter('');
    setStatusFilter('');
    setAttendanceRange('');
    setSearchQuery('');
    setCurrentPage(1);
    setIsFilterDrawerOpen(false);
  };

  const handleConfirmAction = () => {
    if (!targetTeacher) return;

    if (dialogAction === 'delete') {
      const ok = teacherService.deleteTeacher(targetTeacher.id);
      if (ok) {
        success('Faculty Profile Deleted', `${targetTeacher.fullName} has been removed from the registry.`);
        loadTeachers();
      } else {
        toastError('Delete Failed', 'Could not delete teacher record.');
      }
    } else if (dialogAction === 'toggleStatus') {
      const newStatus: TeacherStatus = targetTeacher.status === 'active' ? 'inactive' : 'active';
      teacherService.updateTeacherStatus(targetTeacher.id, newStatus);
      success(
        `Faculty Status Changed to ${newStatus.toUpperCase()}`,
        `Updated status for ${targetTeacher.fullName}.`
      );
      loadTeachers();
    }

    setDialogAction(null);
    setTargetTeacher(null);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Faculty Registry & Roster"
        description="Search, filter, assign and manage faculty records and credentials."
        breadcrumbs={[
          { label: 'Teacher Management', path: '/admin/teachers' },
          { label: 'Faculty Registry' },
        ]}
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="primary"
              size="sm"
              onClick={() => navigate('/admin/teachers/new')}
              leftIcon={<UserPlus className="w-4 h-4" />}
            >
              Add Faculty Member
            </Button>
          </div>
        }
      />

      {/* Search & Filter Toolbar */}
      <div className="p-4 rounded-xl bg-[#171311] border border-[#3A2922] space-y-3">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <SearchBar
            value={searchQuery}
            onChange={(val) => {
              setSearchQuery(val);
              setCurrentPage(1);
            }}
            placeholder="Search by name, faculty ID, email, subject, department..."
            className="flex-1"
          />

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <Button
              variant={hasActiveFilters ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setIsFilterDrawerOpen(true)}
              leftIcon={<SlidersHorizontal className="w-4 h-4" />}
            >
              Filters {hasActiveFilters && '(Active)'}
            </Button>

            {hasActiveFilters && (
              <Button variant="ghost" size="sm" onClick={clearFilters} className="text-xs">
                Clear All
              </Button>
            )}
          </div>
        </div>

        {/* Quick Filter Chips */}
        <div className="flex items-center gap-2 flex-wrap pt-1 text-xs text-[#A89A91]">
          <span className="text-[11px] font-semibold text-[#7A6F68] uppercase">Quick Status:</span>
          {['', 'active', 'inactive', 'suspended'].map((st) => (
            <button
              key={st}
              onClick={() => {
                setStatusFilter(st);
                setCurrentPage(1);
              }}
              className={`px-2.5 py-1 rounded-full text-xs transition-colors cursor-pointer capitalize ${
                statusFilter === st
                  ? 'bg-[#5A321F] text-[#F1E5D8] font-semibold border border-[#7A4930]'
                  : 'bg-[#111111] text-[#A89A91] hover:text-[#F5F0EA] border border-[#3A2922]'
              }`}
            >
              {st || 'All'}
            </button>
          ))}
        </div>
      </div>

      {/* Teachers Data Table */}
      {paginatedTeachers.length === 0 ? (
        <EmptyState
          title="No Faculty Members Found"
          description={
            hasActiveFilters || searchQuery
              ? 'No faculty matched your specified search keywords or active filters.'
              : 'There are currently no faculty members registered in the academy directory.'
          }
          actionLabel={hasActiveFilters || searchQuery ? 'Reset Search Filters' : 'Add First Faculty'}
          onAction={hasActiveFilters || searchQuery ? clearFilters : () => navigate('/admin/teachers/new')}
          actionIcon={hasActiveFilters || searchQuery ? <X className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
        />
      ) : (
        <div className="space-y-4">
          <Table>
            <TableHead>
              <tr>
                <TableHeaderCell onClick={() => handleSort('fullName')}>
                  <div className="flex items-center gap-1.5">
                    <span>Faculty Member</span>
                    <ArrowUpDown className="w-3.5 h-3.5 text-[#A89A91]" />
                  </div>
                </TableHeaderCell>
                <TableHeaderCell>Faculty ID</TableHeaderCell>
                <TableHeaderCell onClick={() => handleSort('department')}>
                  <div className="flex items-center gap-1.5">
                    <span>Department & Subject</span>
                    <ArrowUpDown className="w-3.5 h-3.5 text-[#A89A91]" />
                  </div>
                </TableHeaderCell>
                <TableHeaderCell>Workload</TableHeaderCell>
                <TableHeaderCell onClick={() => handleSort('attendanceRate')}>
                  <div className="flex items-center gap-1.5">
                    <span>Attendance</span>
                    <ArrowUpDown className="w-3.5 h-3.5 text-[#A89A91]" />
                  </div>
                </TableHeaderCell>
                <TableHeaderCell onClick={() => handleSort('status')}>
                  <div className="flex items-center gap-1.5">
                    <span>Status</span>
                    <ArrowUpDown className="w-3.5 h-3.5 text-[#A89A91]" />
                  </div>
                </TableHeaderCell>
                <TableHeaderCell onClick={() => handleSort('joiningDate')}>
                  <div className="flex items-center gap-1.5">
                    <span>Joined</span>
                    <ArrowUpDown className="w-3.5 h-3.5 text-[#A89A91]" />
                  </div>
                </TableHeaderCell>
                <TableHeaderCell className="text-right">Actions</TableHeaderCell>
              </tr>
            </TableHead>
            <TableBody>
              {paginatedTeachers.map((teacher) => (
                <TableRow
                  key={teacher.id}
                  onClick={() => navigate(`/admin/teachers/${teacher.id}`)}
                >
                  {/* Name & Avatar */}
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar src={teacher.avatar} name={teacher.fullName} size="sm" />
                      <div>
                        <span className="font-bold text-[#F5F0EA] hover:text-[#F1E5D8] transition-colors block text-sm">
                          {teacher.fullName}
                        </span>
                        <span className="text-xs text-[#A89A91] block">{teacher.email}</span>
                      </div>
                    </div>
                  </TableCell>

                  {/* Faculty ID */}
                  <TableCell>
                    <span className="px-2 py-0.5 rounded bg-[#2A1710] text-[#F1E5D8] font-mono text-xs border border-[#5A321F]/40 font-semibold">
                      {teacher.teacherId}
                    </span>
                  </TableCell>

                  {/* Department & Primary Subject */}
                  <TableCell>
                    <div>
                      <span className="text-xs font-semibold text-[#F5F0EA] block">{teacher.department}</span>
                      <span className="text-[11px] text-[#A89A91] block">{teacher.primarySubject}</span>
                    </div>
                  </TableCell>

                  {/* Courses & Classes Workload */}
                  <TableCell>
                    <div className="text-xs text-[#A89A91]">
                      <span className="text-[#F5F0EA] font-semibold">{teacher.assignedCourseIds?.length || 0}</span> courses •{' '}
                      <span className="text-[#F5F0EA] font-semibold">{teacher.assignedClassIds?.length || 0}</span> classes
                    </div>
                  </TableCell>

                  {/* Attendance Rate */}
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-[#F5F0EA]">
                        {teacher.attendanceRate || 96}%
                      </span>
                      <div className="w-16 h-1.5 bg-[#2A1710] rounded-full overflow-hidden hidden sm:block">
                        <div
                          className="h-full bg-[#946246] rounded-full"
                          style={{ width: `${teacher.attendanceRate || 96}%` }}
                        />
                      </div>
                    </div>
                  </TableCell>

                  {/* Status */}
                  <TableCell>
                    <StatusBadge status={teacher.status} size="sm" />
                  </TableCell>

                  {/* Joining Date */}
                  <TableCell>
                    <span className="text-xs text-[#A89A91]">
                      {new Date(teacher.joiningDate).toLocaleDateString()}
                    </span>
                  </TableCell>

                  {/* Action Icons */}
                  <TableCell className="text-right">
                    <div
                      className="flex items-center justify-end gap-1"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <IconButton
                        icon={<Eye className="w-4 h-4 text-[#A89A91] hover:text-[#F1E5D8]" />}
                        label="View Faculty Details"
                        size="sm"
                        onClick={() => navigate(`/admin/teachers/${teacher.id}`)}
                      />
                      <IconButton
                        icon={<Edit2 className="w-4 h-4 text-[#A89A91] hover:text-[#F1E5D8]" />}
                        label="Edit Faculty Record"
                        size="sm"
                        onClick={() => navigate(`/admin/teachers/${teacher.id}/edit`)}
                      />
                      <IconButton
                        icon={<Power className={`w-4 h-4 ${teacher.status === 'active' ? 'text-amber-400' : 'text-emerald-400'}`} />}
                        label={teacher.status === 'active' ? 'Deactivate Faculty' : 'Activate Faculty'}
                        size="sm"
                        onClick={() => {
                          setTargetTeacher(teacher);
                          setDialogAction('toggleStatus');
                        }}
                      />
                      <IconButton
                        icon={<Trash2 className="w-4 h-4 text-rose-400" />}
                        label="Delete Faculty"
                        size="sm"
                        onClick={() => {
                          setTargetTeacher(teacher);
                          setDialogAction('delete');
                        }}
                      />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* Pagination */}
          <Pagination
            currentPage={currentPage}
            totalItems={filteredTeachers.length}
            pageSize={pageSize}
            onPageChange={setCurrentPage}
            onPageSizeChange={(size) => {
              setPageSize(size);
              setCurrentPage(1);
            }}
          />
        </div>
      )}

      {/* Filter Drawer */}
      <Drawer
        isOpen={isFilterDrawerOpen}
        onClose={() => setIsFilterDrawerOpen(false)}
        title="Filter Faculty Records"
        description="Narrow down directory listing by academic criteria"
        footer={
          <>
            <Button variant="outline" size="sm" onClick={clearFilters}>
              Reset Filters
            </Button>
            <Button variant="primary" size="sm" onClick={() => setIsFilterDrawerOpen(false)}>
              Apply Filters
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <Select
            label="Department"
            placeholderOption="All Departments"
            value={deptFilter}
            onChange={(e) => setDeptFilter(e.target.value)}
            options={DEPARTMENTS.map((d) => ({ value: d, label: d }))}
          />

          <Select
            label="Designation"
            placeholderOption="All Designations"
            value={designationFilter}
            onChange={(e) => setDesignationFilter(e.target.value)}
            options={DESIGNATIONS.map((d) => ({ value: d, label: d }))}
          />

          <Select
            label="Employment Status"
            placeholderOption="All Statuses"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            options={[
              { value: 'active', label: 'Active Faculty' },
              { value: 'inactive', label: 'Inactive' },
              { value: 'suspended', label: 'Suspended' },
            ]}
          />

          <Select
            label="Attendance Range"
            placeholderOption="All Attendance Records"
            value={attendanceRange}
            onChange={(e) => setAttendanceRange(e.target.value)}
            options={[
              { value: 'above95', label: 'High Compliance (≥ 95%)' },
              { value: '90to95', label: 'Moderate Compliance (90% - 95%)' },
              { value: 'below90', label: 'Attention Needed (< 90%)' },
            ]}
          />
        </div>
      </Drawer>

      {/* Confirmation Dialog */}
      <ConfirmDialog
        isOpen={!!dialogAction}
        onClose={() => {
          setDialogAction(null);
          setTargetTeacher(null);
        }}
        onConfirm={handleConfirmAction}
        title={
          dialogAction === 'delete'
            ? 'Delete Faculty Profile'
            : targetTeacher?.status === 'active'
            ? 'Deactivate Faculty Member'
            : 'Activate Faculty Member'
        }
        message={
          dialogAction === 'delete'
            ? `Are you certain you want to permanently delete the profile for ${targetTeacher?.fullName} (${targetTeacher?.teacherId})? All academic history will be unlinked.`
            : `Are you sure you want to change the status of ${targetTeacher?.fullName} to ${
                targetTeacher?.status === 'active' ? 'INACTIVE' : 'ACTIVE'
              }?`
        }
        confirmText={dialogAction === 'delete' ? 'Delete Profile' : 'Confirm Status Change'}
        variant={dialogAction === 'delete' ? 'danger' : 'warning'}
      />
    </div>
  );
};
