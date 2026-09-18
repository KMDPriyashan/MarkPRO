import Modal from './Modal'

/**
 * Render a confirmation dialog for destructive actions.
 *
 * @param {{title: string, message: string, confirmLabel?: string, onConfirm: Function, onCancel: Function}} props - Dialog properties.
 * @returns {JSX.Element} Confirmation modal.
 */
export default function ConfirmDialog({ title, message, confirmLabel = 'Confirm', onConfirm, onCancel }) {
  return <Modal onClose={onCancel} title={title}><div className="p-6"><p className="text-sm leading-6 text-slate-500">{message}</p><div className="mt-6 flex justify-end gap-3"><button className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50" onClick={onCancel} type="button">Cancel</button><button className="rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-red-700" onClick={onConfirm} type="button">{confirmLabel}</button></div></div></Modal>
}
