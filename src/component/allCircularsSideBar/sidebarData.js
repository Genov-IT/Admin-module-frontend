import React from 'react';
import {
  
  DesktopOutlined,
  UserOutlined,
  TeamOutlined,
  FilePdfOutlined,
  HomeOutlined
} from '@ant-design/icons';

export const items = [
  {
    label: 'Home',
    key: '1',
    icon: <HomeOutlined />,
    link: '/landing',
    value: '',
    
    
    
  },
  {
    label: 'All',
    key: '2',
    icon: <FilePdfOutlined />,
  
    value: 'All',
    
    
    
  },

  {
    label: 'Chairman',
    key: '3',
    icon: <FilePdfOutlined />,    
    value: 'Chairman',    
    
  },

  {
    label: 'Director General',
    key: '4',
    icon: <FilePdfOutlined />,    
    value: 'Director General',    
    
  },

  {
    label: 'HRD, Admin & Finance',
    key: '5',
    icon: <FilePdfOutlined />,
    children: [
      { icon: <FilePdfOutlined /> , label: 'Admin', key: '0', value: 'Admin', onClick: (name) => {} },
      { icon: <FilePdfOutlined /> , label: 'Human Resource', key: '1', value: 'Human Resource', onClick: (name) => {} },
      { icon: <FilePdfOutlined /> , label: 'Finance', key: '2', value: 'Finance', onClick: (name) => {} },
    ],
  },

  {
    label: 'Env.Pollution Control',
    key: '6',
    icon: <FilePdfOutlined />,
    children: [
      { icon: <FilePdfOutlined /> , label: 'EPC', key: '0', value: 'EPC', onClick: (name) => {} },
      { icon: <FilePdfOutlined /> , label: 'Laboratory services', key: '1', value: 'Laboratory services', onClick: (name) => {} }
     
    ],
  },

  {
    label: 'Env.Mnge & Assesment',
    key: '7',
    icon: <FilePdfOutlined />,
    children: [
      { icon: <FilePdfOutlined /> , label: 'NRM', key: '0', value: 'NRM', onClick: (name) => {} },
      { icon: <FilePdfOutlined /> , label: 'EIA', key: '1', value: 'EIA', onClick: (name) => {} },
      { icon: <FilePdfOutlined /> , label: 'SEA', key: '2', value: 'SEA', onClick: (name) => {} }
     
    ],
  },

  {
    label: 'Env.Edu & Awareness',
    key: '8',
    icon: <FilePdfOutlined />,
    children: [
      { icon: <FilePdfOutlined /> , label: 'Environment Education', key: '0', value: 'Environment Education', onClick: (name) => {} },
      { icon: <FilePdfOutlined /> , label: 'Environment Promotion', key: '1', value: 'Environment Promotion', onClick: (name) => {} },
      { icon: <FilePdfOutlined /> , label: 'NEIC/library', key: '2', value: 'NEIC/library', onClick: (name) => {} }
     
    ],
  },

  
  {
    label: 'Waste Management',
    key: '9',
    icon: <FilePdfOutlined />,
    children: [
      { icon: <FilePdfOutlined /> , label: 'HWCM', key: '0', value: 'HWCM', onClick: (name) => {} },
      { icon: <FilePdfOutlined /> , label: 'Solid Waste Management', key: '1', value: 'Solid Waste Management', onClick: (name) => {} }      
     
    ],
  },

  {
    label: 'Regional Operation',
    key: '10',
    icon: <FilePdfOutlined />,
    children: [
      { icon: <FilePdfOutlined /> , label: 'Compliance Monitoring', key: '0', value: 'Compliance Monitoring', onClick: (name) => {} },
      { icon: <FilePdfOutlined /> , label: 'IT unit', key: '1', value: 'IT unit', onClick: (name) => {} }      
     
    ],
  },

  {
    label: 'Planning Unit',
    key: '11',
    icon: <FilePdfOutlined />,    
    value: 'Planning Unit',    
    
  },

  {
    label: 'R & D Unit',
    key: '12',
    icon: <FilePdfOutlined />,    
    value: 'R & D Unit',    
    
  },

  {
    label: 'Legal',
    key: '13',
    icon: <FilePdfOutlined />,    
    value: 'Legal',    
    
  },

  {
    label: 'Internal Audit',
    key: '14',
    icon: <FilePdfOutlined />,    
    value: 'Internal Audit',    
    
  },

  {
    label: 'Investigation Unit',
    key: '15',
    icon: <FilePdfOutlined />,    
    value: 'Investigation Unit',    
    
  },

  {
    label: 'Other',
    key: '16',
    icon: <FilePdfOutlined />,    
    value: 'Other',    
    
  },

];



export default items;
