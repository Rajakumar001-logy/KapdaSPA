export type OrderStatus =
  | 'scheduled'
  | 'picked_up'
  | 'cleaning'
  | 'ready'
  | 'out_for_delivery'
  | 'delivered'
  | 'cancelled'

export type ServiceType =
  | 'wash_fold'
  | 'wash_iron'
  | 'dry_cleaning'
  | 'shoe_cleaning'
  | 'blanket_cleaning'
  | 'premium_care'

export interface Profile {
  id: string
  full_name: string | null
  phone: string | null
  address: string | null
  city: string | null
  pin_code: string | null
  created_at: string
  updated_at: string
}

export interface Order {
  id: string
  user_id: string
  order_number: string
  service_type: ServiceType
  status: OrderStatus
  pickup_date: string
  pickup_time: string
  delivery_date: string | null
  delivery_time: string | null
  address: string
  item_count: number
  notes: string | null
  estimated_delivery: string | null
  created_at: string
  updated_at: string
}

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: Profile
        Insert: {
          id: string
          full_name?: string | null
          phone?: string | null
          address?: string | null
          city?: string | null
          pin_code?: string | null
        }
        Update: {
          full_name?: string | null
          phone?: string | null
          address?: string | null
          city?: string | null
          pin_code?: string | null
        }
      }
      orders: {
        Row: Order
        Insert: {
          user_id: string
          service_type: ServiceType
          pickup_date: string
          pickup_time: string
          address: string
          item_count?: number
          notes?: string | null
          estimated_delivery?: string | null
          delivery_date?: string | null
          delivery_time?: string | null
          status?: OrderStatus
        }
        Update: Partial<Omit<Order, 'id' | 'user_id' | 'order_number'>>
      }
    }
  }
}

export const SERVICE_LABELS: Record<ServiceType, string> = {
  wash_fold: 'Wash & Fold',
  wash_iron: 'Wash & Iron',
  dry_cleaning: 'Dry Cleaning',
  shoe_cleaning: 'Shoe Cleaning',
  blanket_cleaning: 'Blanket Cleaning',
  premium_care: 'Premium Garment Care',
}

export const STATUS_LABELS: Record<OrderStatus, string> = {
  scheduled: 'Pickup Scheduled',
  picked_up: 'Picked Up',
  cleaning: 'Being Cleaned',
  ready: 'Ready for Delivery',
  out_for_delivery: 'Out for Delivery',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
}

export const STATUS_STEPS: OrderStatus[] = [
  'scheduled',
  'picked_up',
  'cleaning',
  'ready',
  'out_for_delivery',
  'delivered',
]
