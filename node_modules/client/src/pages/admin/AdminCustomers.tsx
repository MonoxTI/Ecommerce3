import { useQuery } from '@tanstack/react-query';
import API from '../../services/api';

const AdminCustomers = () => {
  const { data: customers = [], isLoading } = useQuery({
    queryKey: ['admin-customers'],
    queryFn: () => API.get('/users').then(r => r.data),
  });

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-white text-3xl font-bold" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>Customers</h1>
        <p className="text-[#888888] text-sm">{customers.length} registered users</p>
      </div>

      <div className="bg-[#111111] border border-[#1a1a1a] rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#1a1a1a]">
              {['Name', 'Email', 'Role', 'Joined'].map(h => (
                <th key={h} className="text-left text-[#888888] text-xs font-medium tracking-wider uppercase px-4 py-3">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="border-b border-[#1a1a1a]">
                  {Array.from({ length: 4 }).map((_, j) => (
                    <td key={j} className="px-4 py-3"><div className="h-4 bg-[#1a1a1a] rounded animate-pulse" /></td>
                  ))}
                </tr>
              ))
            ) : customers.length === 0 ? (
              <tr><td colSpan={4} className="text-center text-[#888888] py-12">No customers yet</td></tr>
            ) : (
              customers.map((c: any) => (
                <tr key={c.id} className="border-b border-[#1a1a1a] hover:bg-[#1a1a1a]/50 transition-colors">
                  <td className="px-4 py-3 text-white text-sm font-medium">{c.name}</td>
                  <td className="px-4 py-3 text-[#888888] text-sm">{c.email}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-1 rounded-full ${c.role === 'admin' ? 'bg-[#c9a84c]/10 text-[#c9a84c]' : 'bg-[#1a1a1a] text-[#888888]'}`}>
                      {c.role}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-[#888888] text-xs">{new Date(c.createdAt).toLocaleDateString()}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminCustomers;