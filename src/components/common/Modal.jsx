import { FiX } from 'react-icons/fi'

/**
 * Render a reusable accessible modal surface.
 *
 * @param {{title: string, children: import('react').ReactNode, onClose: Function, maxWidth?: string}} props - Modal properties.
 * @returns {JSX.Element} Modal overlay and content.
 */
export default function Modal({ title, children, onClose, maxWidth = 'max-w-lg' }) {
  return <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4" role="presentation"><section aria-labelledby="modal-title" className={`max-h-[92vh] w-full ${maxWidth} overflow-y-auto rounded-2xl bg-white shadow-2xl`} role="dialog"><div className="flex items-center justify-between border-b border-slate-100 px-6 py-4"><h2 className="font-bold text-slate-900" id="modal-title">{title}</h2><button aria-label="Close modal" className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700" onClick={onClose} type="button"><FiX /></button></div>{children}</section></div>
}
