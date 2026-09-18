import { NextResponse } from 'next/server';
import { getDatabase } from '@/lib/database/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const customerId = searchParams.get('id');
    const db = await getDatabase();

    // If specific customer ID requested, return full profile with order history
    if (customerId) {
      const customer = db.customers.find((c) => c.id === customerId);
      if (!customer) {
        return NextResponse.json({ error: 'Customer not found' }, { status: 404 });
      }

      const customerOrders = db.orders
        .filter((o) => o.customer_id === customer.id)
        .map((o) => {
          const items = db.order_items.filter((it) => it.order_id === o.id);
          return {
            ...o,
            items,
          };
        })
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

      const totalSpent = customerOrders
        .filter((o) => o.order_status !== 'Cancelled')
        .reduce((sum, o) => sum + o.total_amount, 0);

      return NextResponse.json({
        success: true,
        customer: {
          ...customer,
          totalOrders: customerOrders.length,
          totalSpent,
          orders: customerOrders,
        },
      });
    }

    // Return aggregated customers list
    const customersWithMetrics = db.customers.map((c) => {
      const customerOrders = db.orders.filter((o) => o.customer_id === c.id);
      const totalSpent = customerOrders
        .filter((o) => o.order_status !== 'Cancelled')
        .reduce((sum, o) => sum + o.total_amount, 0);

      const sorted = [...customerOrders].sort(
        (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
      const lastOrderDate = sorted[0]?.created_at || c.created_at;

      return {
        id: c.id,
        fullName: c.full_name,
        phone: c.phone,
        email: c.email,
        city: c.city,
        state: c.state,
        pincode: c.pincode,
        totalOrders: customerOrders.length,
        totalSpent,
        lastOrderDate,
      };
    });

    // Sort by most orders / highest spend first
    customersWithMetrics.sort((a, b) => b.totalSpent - a.totalSpent);

    return NextResponse.json({
      success: true,
      customers: customersWithMetrics,
      totalCount: customersWithMetrics.length,
    });
  } catch (error: unknown) {
    console.error('Error fetching customers:', error);
    const message = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}