import { useMemo } from "react";
import DataTable from "react-data-table-component";

// A super simple expandable component.
const ExpandedComponent = ({ data }: any) => (
  <pre>{JSON.stringify(data, null, 2)}</pre>
);

const columns = [
  {
    name: "Title",
    selector: (row: any) => row.title,
  },
  {
    name: "Year",
    selector: (row: any) => row.year,
  },
];

const data = [
  {
    id: 1,
    title: "Beetlejuice",
    year: "1988",
  },
  {
    id: 2,
    title: "Ghostbusters",
    year: "1984",
  },
];

function MainTable() {
  //   const actionsMemo = useMemo(
  //     () => <Export onExport={() => downloadCSV(data)} />,
  //     []
  //   );

  return (
    <DataTable
      title="Movie List"
      columns={columns}
      data={data}
      actions={actionsMemo}
    />
  );
  return (
    <DataTable
      columns={columns}
      data={data}
      expandableRows
      expandableRowsComponent={ExpandedComponent}
    />
  );
}

export default MainTable;
