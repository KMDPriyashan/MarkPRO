import { FiInbox } from 'react-icons/fi'

/**
 * Render a consistent empty collection state.
 *
 * @param {{message: string, icon?: import('react').ComponentType, action?: import('react').ReactNode}} props - Empty state properties.
 * @returns {JSX.Element} Empty state.
 */
export default function EmptyState({ message, icon: Icon = FiInbox, action }) {
  return <div className="flex flex-col items-center justify-center px-6 py-12 text-center"><span className="rounded-full bg-slate-100 p-4 text-slate-400"><Icon size={24} /></span><p className="mt-4 text-sm text-slate-500">{message}</p>{action && <div className="mt-4">{action}</div>}</div>
}
