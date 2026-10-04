import { supabase } from '../lib/supabase';
import { FeeRecord, PaymentTransaction, FeeStatus } from '../types';

function rowToFeeRecord(row: Record<string, unknown>): FeeRecord {
  return {
    id: row.id as string,
    invoiceNumber: (row.invoice_number as string) || (row.id as string),
    studentId: (row.student_id as string) || '',
    studentName: (row.student_name as string) || '',
    studentIdCode: (row.student_id_code as string) || '',
    courseId: (row.course_id as string) || '',
    courseName: (row.course_name as string) || '',
    batchName: (row.batch_name as string) || '',
    feePlan: (row.fee_plan as string) || 'Semester Installments',
    totalAmount: (row.total_amount as number) || 0,
    paidAmount: (row.paid_amount as number) || 0,
    remainingAmount: (row.remaining_amount as number) || 0,
    dueDate: (row.due_date as string) || '',
    status: ((row.status as string) || 'pending') as FeeStatus,
    lastPaymentDate: (row.last_payment_date as string) || '',
  };
}

function rowToPayment(row: Record<string, unknown>): PaymentTransaction {
  return {
    id: row.id as string,
    receiptNumber: (row.receipt_number as string) || (row.id as string),
    studentId: (row.student_id as string) || '',
    studentName: (row.student_name as string) || '',
    studentIdCode: (row.student_id_code as string) || '',
    feeRecordId: (row.fee_record_id as string) || '',
    amount: (row.amount as number) || 0,
    paymentDate: (row.created_at as string)?.split('T')[0] || '',
    paymentMethod: (row.payment_method as PaymentTransaction['paymentMethod']) || 'UPI',
    transactionReference: (row.transaction_reference as string) || '',
    collectedBy: (row.collected_by as string) || 'Admin',
    remarks: (row.remarks as string) || '',
    status: ((row.status as string) || 'successful') as PaymentTransaction['status'],
  };
}

export const getFeeRecords = async (): Promise<FeeRecord[]> => {
  const { data, error } = await supabase
    .from('fee_records')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('[feeService] getFeeRecords:', error.message);
    return [];
  }
  return (data || []).map(rowToFeeRecord);
};

export const getPayments = async (): Promise<PaymentTransaction[]> => {
  const { data, error } = await supabase
    .from('payment_transactions')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('[feeService] getPayments:', error.message);
    return [];
  }
  return (data || []).map(rowToPayment);
};

export const recordPayment = async (paymentData: Partial<PaymentTransaction>): Promise<PaymentTransaction | null> => {
  const receiptNum = `RCP-${Date.now().toString().slice(-6)}`;
  const { data, error } = await supabase
    .from('payment_transactions')
    .insert({
      receipt_number: receiptNum,
      student_id: paymentData.studentId || null,
      student_name: paymentData.studentName || '',
      student_id_code: paymentData.studentIdCode || '',
      fee_record_id: paymentData.feeRecordId || null,
      amount: paymentData.amount || 0,
      payment_method: paymentData.paymentMethod || 'UPI',
      transaction_reference: paymentData.transactionReference || `TXN-${Date.now()}`,
      collected_by: paymentData.collectedBy || 'Admin',
      remarks: paymentData.remarks || '',
      status: paymentData.status || 'successful',
    })
    .select()
    .single();

  if (error || !data) return null;

  // Update fee record paid amount
  if (paymentData.feeRecordId && paymentData.amount) {
    const { data: fee } = await supabase.from('fee_records').select('*').eq('id', paymentData.feeRecordId).single();
    if (fee) {
      const newPaid = (fee.paid_amount || 0) + paymentData.amount;
      const newRemaining = Math.max(0, (fee.total_amount || 0) - newPaid);
      const newStatus = newRemaining === 0 ? 'paid' : newPaid > 0 ? 'partially_paid' : 'pending';

      await supabase.from('fee_records').update({
        paid_amount: newPaid,
        remaining_amount: newRemaining,
        status: newStatus,
        last_payment_date: new Date().toISOString().split('T')[0],
      }).eq('id', paymentData.feeRecordId);
    }
  }

  await supabase.from('activity_logs').insert({
    action: 'Recorded Payment',
    module: 'fees',
    entity: data.student_name,
    description: `Recorded payment of ₹${data.amount} for ${data.student_name} (${receiptNum})`,
    admin_name: 'Admin',
  });

  return rowToPayment(data);
};

export const getFees = getFeeRecords;

export const feeService = {
  getFeeRecords,
  getFees,
  getPayments,
  recordPayment,
};
