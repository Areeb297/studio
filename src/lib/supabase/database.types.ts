export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      sales_orders: {
        Row: {
          id: string;
          order_number: string;
          order_date: string | null;
          customer_id: string | null;
          waiter_id: string | null;
          subtotal: number;
          tax_amount: number | null;
          service_charge: number | null;
          discount_amount: number | null;
          delivery_charges: number | null;
          total_amount: number;
          payment_status: string | null;
          order_status: string | null;
          kitchen_status: string | null;
          special_instructions: string | null;
          created_at: string | null;
          updated_at?: string | null;
        };
        Insert: {
          id?: string;
          order_number: string;
          order_date?: string | null;
          customer_id?: string | null;
          waiter_id?: string | null;
          subtotal: number;
          tax_amount?: number | null;
          service_charge?: number | null;
          discount_amount?: number | null;
          delivery_charges?: number | null;
          total_amount: number;
          payment_status?: string | null;
          order_status?: string | null;
          kitchen_status?: string | null;
          special_instructions?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["sales_orders"]["Insert"]>;
        Relationships: [];
      };
      sales_order_items: {
        Row: {
          id: string;
          sales_order_id: string;
          menu_item_id: string | null;
          quantity: number;
          unit_price: number;
          total_price: number;
          special_instructions: string | null;
          created_at: string | null;
        };
        Insert: {
          id?: string;
          sales_order_id: string;
          menu_item_id?: string | null;
          quantity: number;
          unit_price: number;
          total_price: number;
          special_instructions?: string | null;
          created_at?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["sales_order_items"]["Insert"]>;
        Relationships: [];
      };
    };
    Views: {};
    Functions: {};
    Enums: {};
    CompositeTypes: {};
  };
}


