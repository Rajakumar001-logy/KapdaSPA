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

export type LocationStatus = 'served' | 'unserved'

export interface Profile {
  id: string
  full_name: string | null
  phone: string | null
  address: string | null
  city: string | null
  pin_code: string | null
  location_status: LocationStatus | null
  created_at: string
  updated_at: string
}

export interface Laundry {
  id: string
  name: string
  city: string
  address: string | null
  phone: string | null
  rating: number | null
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface LaundryService {
  id: string
  laundry_id: string
  name: string
  service_type: string
  price: number
  price_unit: string
  description: string | null
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Order {
  id: string
  user_id: string
  order_number: string
  service_type: ServiceType | null
  status: OrderStatus
  pickup_date: string
  pickup_time: string
  delivery_date: string | null
  delivery_time: string | null
  address: string
  item_count: number
  notes: string | null
  estimated_delivery: string | null
  laundry_id: string | null
  laundry_service_id: string | null
  laundry_name: string | null
  service_name: string | null
  service_price: number | null
  delivery_charge: number | null
  total_amount: number | null
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
          location_status?: LocationStatus | null
        }
        Update: {
          full_name?: string | null
          phone?: string | null
          address?: string | null
          city?: string | null
          pin_code?: string | null
          location_status?: LocationStatus | null
        }
      }
      laundries: {
        Row: Laundry
        Insert: Partial<Laundry> & Pick<Laundry, 'name' | 'city'>
        Update: Partial<Omit<Laundry, 'id'>>
      }
      laundry_services: {
        Row: LaundryService
        Insert: Partial<LaundryService> & Pick<LaundryService, 'laundry_id' | 'name' | 'service_type' | 'price'>
        Update: Partial<Omit<LaundryService, 'id'>>
      }
      orders: {
        Row: Order
        Insert: {
          user_id: string
          pickup_date: string
          pickup_time: string
          address: string
          item_count?: number
          notes?: string | null
          estimated_delivery?: string | null
          delivery_date?: string | null
          delivery_time?: string | null
          status?: OrderStatus
          service_type?: ServiceType | null
          laundry_id?: string | null
          laundry_service_id?: string | null
          laundry_name?: string | null
          service_name?: string | null
          service_price?: number | null
          delivery_charge?: number | null
          total_amount?: number | null
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

export function orderServiceLabel(order: Order): string {
  return order.service_name ?? (order.service_type ? SERVICE_LABELS[order.service_type] : 'Laundry Service')
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
