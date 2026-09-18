import { useState } from 'react'
import { FiCheck, FiUpload, FiX } from 'react-icons/fi'
import { toast } from 'react-toastify'
import Loader from '../common/Loader'

const sampleCsv = 'fullName,username,email,phone,department,designation,baseSalary\nAmal Silva,amal.silva,amal@attendease.com,0771234567,Engineering,Software Engineer,150000'

/**
 * Render a CSV upload and preview modal for employee imports.
 *
 * @param {{onClose: Function, onImport: Function}} props - Import modal properties.
 * @returns {JSX.Element} Bulk import modal.
 */
export default function BulkImport({ onClose, onImport }) {
  const [rows, setRows] = useState([])
  const [fileName, setFileName] = useState('')
  const [parsing, setParsing] = useState(false)

  function parseCsv(event) {
    const file = event.target.files?.[0]
    if (!file) return
    setFileName(file.name)
    setParsing(true)
    const reader = new FileReader()
    reader.onload = () => {
      const lines = String(reader.result).split(/\r?\n/).filter((line) => line.trim())
      const headers = lines.shift().split(',').map((header) => header.trim().toLowerCase().replace(/\s+/g, ''))
      const parsedRows = lines.map((line) => {
        const values = line.split(',').map((value) => value.trim())
        return headers.reduce((record, header, index) => ({ ...record, [header]: values[index] ?? '' }), {})
      }).filter((row) => row.fullname && row.email)
      setRows(parsedRows)
      setParsing(false)
      if (!parsedRows.length) toast.error('No valid employee rows found in this CSV.')
    }
    reader.readAsText(file)
  }

  function confirmImport() {
    if (!rows.length) {
      toast.error('Upload a CSV file with employee rows first.')
      return
    }
    onImport(rows)
  }

  return <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4" role="presentation"><section aria-labelledby="bulk-import-title" className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl sm:p-8" role="dialog"><div className="flex items-start justify-between"><div><p className="text-sm font-semibold uppercase tracking-widest text-blue-600">Employee directory</p><h2 className="mt-2 text-2xl font-bold text-slate-900" id="bulk-import-title">Bulk import employees</h2><p className="mt-2 text-sm text-slate-500">Upload a CSV, review the preview, then confirm the import.</p></div><button aria-label="Close bulk import" className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700" onClick={onClose} type="button"><FiX size={20} /></button></div><div className="mt-6 rounded-xl border-2 border-dashed border-blue-200 bg-blue-50/50 p-6 text-center"><FiUpload className="mx-auto text-blue-600" size={28} /><p className="mt-3 text-sm font-semibold text-slate-700">Choose an employee CSV file</p><p className="mt-1 text-xs text-slate-500">{fileName || 'CSV files only'}</p><label className="mt-4 inline-flex cursor-pointer rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700">Browse file<input accept=".csv,text/csv" className="sr-only" onChange={parseCsv} type="file" /></label></div>{parsing && <Loader label="Parsing CSV..." />}<div className="mt-5 rounded-lg bg-slate-50 p-4"><p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Sample CSV format</p><code className="mt-2 block overflow-x-auto whitespace-pre text-xs text-slate-600">{sampleCsv}</code></div>{rows.length > 0 && <div className="mt-6 overflow-x-auto rounded-lg border border-slate-200"><table className="min-w-full text-left text-sm"><thead className="bg-slate-50 text-xs uppercase text-slate-500"><tr>{Object.keys(rows[0]).map((header) => <th className="whitespace-nowrap px-4 py-3" key={header}>{header}</th>)}</tr></thead><tbody className="divide-y divide-slate-100">{rows.map((row, index) => <tr key={`${row.email}-${index}`}>{Object.keys(rows[0]).map((header) => <td className="whitespace-nowrap px-4 py-3 text-slate-600" key={header}>{row[header]}</td>)}</tr>)}</tbody></table></div>}<div className="mt-7 flex justify-end gap-3"><button className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50" onClick={onClose} type="button">Cancel</button><button className="flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700" onClick={confirmImport} type="button"><FiCheck />Confirm Import</button></div></section></div>
}
