// https://swr.vercel.app/ja/docs/getting-started
// https://swr.vercel.app/docs/data-fetching

import axios from 'axios'
import useSWR from 'swr'
import { DataGrid } from '@mui/x-data-grid';
import Box from '@mui/material/Box';

const fetcher = url => axios.get(url).then(res => res.data)

export default function swr() {
  return Profile()
}

function Profile() {
  const { data, error } = useSWR('/api/product/modelview/product/', fetcher)

  if (error) return <div>failed to load</div>
  if (!data) return <div>loading...</div>

  const columns = [
    {
      field: 'id',
      headerName: 'id',
    },
    {
      field: 'name',
      headerName: 'name',
    },
  ];

  // データをレンダリングする
  return (
    <div>
      <h2>通常のtable</h2>
      <table>
        <thead>
          <tr>
            <th>id</th>
            <th>name</th>
          </tr>
        </thead>
        <tbody>
          {data.map((data) => (
            <tr key={data.id}>
              <td>{data.id}</td>
              <td>{data.name}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>MUIのDataGrid https://mui.com/x/react-data-grid/</h2>
      <Box sx={{ height: 400, width: '100%' }}>
        <DataGrid
          getRowId={(row) => row.id}
          rows={data}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5]}
          experimentalFeatures={{ newEditingApi: true }}
        />
      </Box>
    </div>
  )
}