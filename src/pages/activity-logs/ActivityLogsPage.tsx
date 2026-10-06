import React, { useState, useMemo, useEffect } from 'react';
import {
  Shield,
  Search,
  Trash2,
  Filter,
  Clock,
  User,
  Activity,
  Calendar,
} from 'lucide-react';

import { PageHeader } from '../../components/common/PageHeader';
import { Button } from '../../components/common/Button';
import { IconButton } from '../../components/common/IconButton';
import { SearchBar } from '../../components/common/SearchBar';
import { Table, TableHead, TableBody, TableRow, TableHeaderCell, TableCell } from '../../components/common/Table';
import { Pagination } from '../../components/common/Pagination';
import { Select } from '../../components/common/Select';
import { EmptyState } from '../../components/common/EmptyState';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { useToast } from '../../context/ToastContext';

import { activityService } from '../../services/activityService';
import { ActivityLog } from '../../types';

export const ActivityLogsPage: React.FC = () => {
  const { success } = useToast();

  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [moduleFilter, setModuleFilter] = useState('');
  const [isClearConfirmOpen, setIsClearConfirmOpen] = useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(15);

  const loadData = async () => {
    const l = await activityService.getLogs();
    setLogs(l);
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        log.action.toLowerCase().includes(q) ||
        log.entity.toLowerCase().includes(q) ||
        log.description.toLowerCase().includes(q) ||
        (log.adminName && log.adminName.toLowerCase().includes(q));

      const matchesModule = !moduleFilter || log.module === moduleFilter;

      return matchesSearch && matchesModule;
    });
  }, [logs, searchQuery, moduleFilter]);

  const paginatedLogs = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredLogs.slice(start, start + pageSize);
  }, [filteredLogs, currentPage, pageSize]);

  const handleClearLogs = async () => {
    await activityService.clearLogs();
    success('Audit Trail Cleared', 'Activity logs have been reset.');
    setIsClearConfirmOpen(false);
    await loadData();
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Administrative Audit Trail & Activity Logs"
        description="Comprehensive audit logging of faculty record modifications, schedule allocations, leave decisions, and credential changes."
        breadcrumbs={[{ label: 'Activity Logs' }]}
        actions={
          logs.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsClearConfirmOpen(true)}
              leftIcon={<Trash2 className="w-4 h-4 text-rose-400" />}
            >
              Clear Audit Log
            </Button>
          )
        }
      />

      {/* Toolbar */}
      <div className="p-4 rounded-xl bg-[#171311] border border-[#3A2922] flex flex-col sm:flex-row items-center justify-between gap-3">
        <SearchBar
          value={searchQuery}
          onChange={(val) => {
            setSearchQuery(val);
            setCurrentPage(1);
          }}
          placeholder="Search by action, administrator, target entity or description..."
          className="flex-1"
        />

        <div className="w-full sm:w-60">
          <Select
            value={moduleFilter}
            onChange={(e) => {
              setModuleFilter(e.target.value);
              setCurrentPage(1);
            }}
            placeholderOption="All Modules"
            options={[
              { value: 'teachers', label: 'Faculty Management' },
              { value: 'attendance', label: 'Attendance' },
              { value: 'applications', label: 'Recruitment Applications' },
              { value: 'courses', label: 'Courses' },
              { value: 'classes', label: 'Classes & Timetable' },
              { value: 'assignments', label: 'Assignments' },
              { value: 'leave', label: 'Leave Approvals' },
              { value: 'auth', label: 'Authentication & Security' },
              { value: 'settings', label: 'System Settings' },
            ]}
          />
        </div>
      </div>

      {/* Logs Table */}
      {paginatedLogs.length === 0 ? (
        <EmptyState
          title="No Activity Logs Recorded"
          description="There are currently no administrative actions logged matching your criteria."
        />
      ) : (
        <div className="space-y-4">
          <Table>
            <TableHead>
              <tr>
                <TableHeaderCell>Timestamp</TableHeaderCell>
                <TableHeaderCell>Action Performed</TableHeaderCell>
                <TableHeaderCell>Module</TableHeaderCell>
                <TableHeaderCell>Target Entity</TableHeaderCell>
                <TableHeaderCell>Description / Notes</TableHeaderCell>
                <TableHeaderCell>Administrator</TableHeaderCell>
              </tr>
            </TableHead>
            <TableBody>
              {paginatedLogs.map((log) => (
                <TableRow key={log.id} hoverable={false}>
                  <TableCell>
                    <div className="flex items-center gap-1.5 text-xs text-[#A89A91]">
                      <Clock className="w-3.5 h-3.5 text-[#946246]" />
                      <span>{new Date(log.timestamp).toLocaleString()}</span>
                    </div>
                  </TableCell>

                  <TableCell>
                    <span className="font-bold text-[#F5F0EA] block">{log.action}</span>
                  </TableCell>

                  <TableCell>
                    <span className="px-2 py-0.5 rounded bg-[#2A1710] text-[#F1E5D8] font-mono text-[11px] uppercase border border-[#5A321F]/40 font-semibold">
                      {log.module}
                    </span>
                  </TableCell>

                  <TableCell>
                    <span className="text-xs font-semibold text-[#F5F0EA]">{log.entity}</span>
                  </TableCell>

                  <TableCell className="text-xs text-[#A89A91] max-w-md">
                    {log.description}
                  </TableCell>

                  <TableCell>
                    <div className="flex items-center gap-1 text-xs text-[#F1E5D8]">
                      <User className="w-3.5 h-3.5 text-[#946246]" />
                      <span>{log.adminName}</span>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <Pagination
            currentPage={currentPage}
            totalItems={filteredLogs.length}
            pageSize={pageSize}
            onPageChange={setCurrentPage}
            onPageSizeChange={setPageSize}
            pageSizeOptions={[15, 30, 50, 100]}
          />
        </div>
      )}

      {/* Clear Confirm Dialog */}
      <ConfirmDialog
        isOpen={isClearConfirmOpen}
        onClose={() => setIsClearConfirmOpen(false)}
        onConfirm={handleClearLogs}
        title="Clear Activity Audit Logs"
        message="Are you sure you want to permanently clear all activity logs? This action cannot be undone."
        confirmText="Clear All Logs"
        variant="danger"
      />
    </div>
  );
};
