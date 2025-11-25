import { Button } from './ui/Button'
import { FileText, FileSpreadsheet } from 'lucide-react'
import {
  exportPlantsToPDF,
  exportPlantsToExcel,
  exportHarvestsToPDF,
  exportHarvestsToExcel,
  exportFinancesToPDF,
  exportFinancesToExcel,
} from '@/lib/export'

export function ExportButtons({ type, data }) {
  const handleExportPDF = () => {
    if (type === 'plants') {
      exportPlantsToPDF(data)
    } else if (type === 'harvests') {
      exportHarvestsToPDF(data)
    } else if (type === 'finances') {
      exportFinancesToPDF(data)
    }
  }

  const handleExportExcel = () => {
    if (type === 'plants') {
      exportPlantsToExcel(data)
    } else if (type === 'harvests') {
      exportHarvestsToExcel(data)
    } else if (type === 'finances') {
      exportFinancesToExcel(data)
    }
  }

  if (!data || data.length === 0) {
    return null
  }

  return (
    <div className="flex gap-2">
      <Button variant="outline" size="sm" onClick={handleExportPDF}>
        <FileText className="h-4 w-4 mr-2" />
        Export PDF
      </Button>
      <Button variant="outline" size="sm" onClick={handleExportExcel}>
        <FileSpreadsheet className="h-4 w-4 mr-2" />
        Export Excel
      </Button>
    </div>
  )
}
