import { db } from '../config/firebase';
import { collection, getDocs, query, where, orderBy, limit } from 'firebase/firestore';

export const getDashboardStats = async () => {
  try {
    // Get total stock
    const productsRef = collection(db, 'products');
    const productsSnap = await getDocs(productsRef);
    const totalStock = productsSnap.docs.reduce((acc, doc) => acc + doc.data().stock, 0);

    // Get total sales and revenue
    const salesRef = collection(db, 'sales');
    const salesSnap = await getDocs(salesRef);
    const salesData = salesSnap.docs.map(doc => doc.data());
    const totalSales = salesData.length;
    const totalRevenue = salesData.reduce((acc, sale) => acc + sale.amount, 0);

    // Get low stock items
    const lowStockQuery = query(productsRef, where('stock', '<', 10));
    const lowStockSnap = await getDocs(lowStockQuery);
    const lowStockItems = lowStockSnap.size;

    // Get pending orders
    const ordersRef = collection(db, 'orders');
    const pendingOrdersQuery = query(ordersRef, where('status', '==', 'pending'));
    const pendingOrdersSnap = await getDocs(pendingOrdersQuery);
    const pendingOrders = pendingOrdersSnap.size;

    return {
      totalStock,
      totalSales,
      totalRevenue,
      lowStockItems,
      pendingOrders
    };
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    throw error;
  }
};

export const getRecentActivities = async () => {
  try {
    const activitiesRef = collection(db, 'activities');
    const recentQuery = query(activitiesRef, orderBy('timestamp', 'desc'), limit(5));
    const activitiesSnap = await getDocs(recentQuery);
    
    return activitiesSnap.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error fetching recent activities:', error);
    throw error;
  }
};

export const getMonthlySalesData = async () => {
  try {
    const salesRef = collection(db, 'sales');
    const salesSnap = await getDocs(salesRef);
    const salesData = salesSnap.docs.map(doc => doc.data());

    // Process sales data by month
    const monthlyData = {};
    salesData.forEach(sale => {
      const date = new Date(sale.timestamp);
      const monthKey = `${date.getFullYear()}-${date.getMonth() + 1}`;
      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = {
          sales: 0,
          demand: 0
        };
      }
      monthlyData[monthKey].sales += sale.quantity;
      monthlyData[monthKey].demand += sale.quantity + (sale.backorders || 0);
    });

    // Convert to chart format
    const labels = Object.keys(monthlyData).sort();
    const datasets = [
      {
        label: 'Sales',
        data: labels.map(key => monthlyData[key].sales),
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1
      },
      {
        label: 'Demand',
        data: labels.map(key => monthlyData[key].demand),
        borderColor: 'rgb(255, 99, 132)',
        tension: 0.1
      }
    ];

    return { labels, datasets };
  } catch (error) {
    console.error('Error fetching monthly sales data:', error);
    throw error;
  }
}; 