'use client'
import { ColumnDefinition, DataTable } from './DataTable'

type Props = {
    data: any[]
    columns: ColumnDefinition<any>[]
}

const CSVReader = ({data, columns}: Props) => {
    return (
      <DataTable data={data} columns={columns} enablePagination/>
    )
}

export default CSVReader