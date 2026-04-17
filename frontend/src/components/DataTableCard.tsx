import Badge from "react-bootstrap/Badge";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Spinner from "react-bootstrap/Spinner";
import Table from "react-bootstrap/Table";

import { PaginationControls } from "@/components/PaginationControls";
import type { DataTableCardProps } from "@/components/DataTableCard.types";

export type { DataTableColumn } from "@/components/DataTableCard.types";

export function DataTableCard<Row>({
  title,
  total,
  rows,
  columns,
  emptyMessage,
  isLoading,
  error,
  onRetry,
  getRowKey,
  currentPage,
  totalPages,
  onPageChange,
  className,
}: DataTableCardProps<Row>) {
  return (
    <Card className={className}>
      <Card.Header className="bg-white border-0 pt-4 px-4">
        <div className="d-flex justify-content-between align-items-center gap-3">
          <h2 className="h5 mb-0">{title}</h2>
        </div>
      </Card.Header>
      <Card.Body className="px-4 pb-4">
        {error ? (
          <div className="d-flex justify-content-between align-items-center gap-3 flex-wrap mb-4">
            <span className="text-danger">{error}</span>
            <Button variant="outline-secondary" size="sm" onClick={onRetry}>
              Повторить
            </Button>
          </div>
        ) : null}

        {isLoading ? (
          <div className="d-flex justify-content-center py-5">
            <Spinner animation="border" />
          </div>
        ) : (
          <>
            <Table hover bordered responsive className="align-middle mb-0">
              <thead className="table-light">
                <tr>
                  {columns.map((column) => (
                    <th key={column.key} className={column.headerClassName}>
                      {column.header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.length === 0 ? (
                  <tr>
                    <td colSpan={columns.length} className="text-center py-4 text-secondary">
                      {emptyMessage}
                    </td>
                  </tr>
                ) : (
                  rows.map((row) => (
                    <tr key={getRowKey(row)}>
                      {columns.map((column) => (
                        <td key={column.key} className={column.cellClassName}>
                          {column.render(row)}
                        </td>
                      ))}
                    </tr>
                  ))
                )}
              </tbody>
            </Table>

            <PaginationControls
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={total}
              onPageChange={onPageChange}
            />
          </>
        )}
      </Card.Body>
    </Card>
  );
}
