/**
 * Display a centered Tailwind loading spinner.
 *
 * @returns {JSX.Element} Loading indicator.
 */
export default function Loader({ label = 'Loading' }) {
  return <div aria-label={label} className="flex items-center justify-center gap-3 p-6 text-sm text-slate-500" role="status"><span className="h-8 w-8 animate-spin rounded-full border-4 border-blue-100 border-t-blue-600" />{label}</div>
}
