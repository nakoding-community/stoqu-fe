// components
import Iconify from '../../../components/Iconify';
import Label from '../../../components/Label';

const getIcon = (name) => <Iconify icon={name} sx={{ width: 1, height: 1 }} />;

const ICONS = {
  dashboard: getIcon('mdi:view-dashboard'),
  officeBuilding: getIcon('mdi:office-building-settings'),
  bagSuitcase: getIcon('mdi:bag-suitcase'),
  bagPersonal: getIcon('mdi:bag-personal'),
  invoiceCheck: getIcon('mdi:invoice-check'),
  analytics: getIcon('mdi:google-analytics'),
  cog: getIcon('mdi:cog'),
  user: getIcon('mdi:user'),
};

export const getSidebarConfig = ({ count }) => {
  return [
    {
      items: [
        { title: 'Dasbor', path: '/dashboard/app', icon: ICONS.dashboard },
        { title: 'Atribut', path: '/dashboard/attribute', icon: ICONS.officeBuilding },
        {
          title: 'Produk',
          path: '/dashboard/product',
          icon: ICONS.bagSuitcase,
          info: (
            <Label variant="outlined" color="error">
              {count?.totalProduct || 0}
            </Label>
          ),
        },
        {
          title: 'Stok',
          path: '/dashboard/stock',
          icon: ICONS.bagPersonal,
          info: (
            <Label variant="outlined" color="error">
              {count?.totalStock || 0}
            </Label>
          ),
        },
        {
          title: 'Pesanan',
          path: '/dashboard/order',
          icon: ICONS.invoiceCheck,
          info: (
            <Label variant="outlined" color="error">
              {count?.totalOrder || 0}
            </Label>
          ),
        },
        {
          title: 'Laporan',
          path: '/dashboard/report',
          icon: ICONS.analytics,
          children: [
            { title: 'Laporan Pemesanan', path: '/dashboard/report/order' },
            { title: 'Laporan Produk', path: '/dashboard/report/product' },
          ],
        },
        {
          title: 'Pengguna',
          path: '/dashboard/settings/user',
          icon: ICONS.user,
        },
        {
          title: 'Pengaturan',
          path: '/dashboard/settings',
          icon: ICONS.cog,
          children: [
            { title: 'Konversi Dollar', path: '/dashboard/settings/dollar-conversion' },
            { title: 'Pengingat Stok', path: '/dashboard/settings/remaind-stock' },
            { title: 'Tipe Konversi', path: '/dashboard/settings/conversion-type' },
          ],
        },
      ],
    },
  ];
};

export const getSidebarConfigByRole = (items, role) => {
  let whitelist = ['Dasbor']
  if (role === "admin") whitelist = ['Dasbor', 'Atribut', 'Produk', 'Stok', 'Pesanan', 'Laporan', 'Pengguna', 'Pengaturan']
  if (role === "admin-stock") whitelist = ['Dasbor', 'Atribut', 'Produk', 'Stok', 'Pesanan', 'Laporan', 'Pengaturan']
  if (role === "admin-order") whitelist = ['Dasbor', 'Stok', 'Pesanan', 'Laporan']

  items[0].items = items[0]?.items?.filter((data) => whitelist.includes(data?.title))
  
  return items
}

const sidebarConfig = [
  {
    items: [
      { title: 'Dashboard', path: '/dashboard/app', icon: ICONS.dashboard },
      { title: 'Attribut', path: '/dashboard/attribute', icon: ICONS.officeBuilding },
      {
        title: 'Produk',
        path: '/dashboard/product',
        icon: ICONS.bagSuitcase,
        info: (
          <Label variant="outlined" color="error">
            1
          </Label>
        ),
      },
      {
        title: 'Stok',
        path: '/dashboard/stock',
        icon: ICONS.bagPersonal,
        info: (
          <Label variant="outlined" color="error">
            +2
          </Label>
        ),
      },
      {
        title: 'Pesanan',
        path: '/dashboard/order',
        icon: ICONS.invoiceCheck,
        info: (
          <Label variant="outlined" color="error">
            +2
          </Label>
        ),
      },
      { title: 'Laporan', path: '/dashboard/report', icon: ICONS.analytics },
      {
        title: 'Pengaturan',
        path: '/dashboard/settings',
        icon: ICONS.cog,
        children: [
          { title: 'User', path: '/dashboard/settings/user' },
          { title: 'Konversi Dollar', path: '/dashboard/settings/dollar-conversion' },
          { title: 'Pengingat Stok', path: '/dashboard/settings/remaind-stock' },
          { title: 'Tipe Konversi', path: '/dashboard/settings/conversion-type' },
        ],
      },
    ],
  },
];

export default sidebarConfig;
