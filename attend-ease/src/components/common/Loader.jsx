/**
 * Display a centered Tailwind loading spinner.
 *
 * @returns {JSX.Element} Loading indicator.
 */
export default function Loader() {
  return <div aria-label="Loading" className="flex items-center justify-center p-6" role="status"><span className="h-8 w-8 animate-spin rounded-full border-4 border-blue-100 border-t-blue-600" /></div>
}
