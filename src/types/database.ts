export interface Database {
  public: {
    Tables: {
      owners: {
        Row: {
          id: string
          email: string
          full_name: string
          phone: string | null
          created_at: string
          is_active: boolean
        }
        Insert: {
          id: string
          email: string
          full_name: string
          phone?: string | null
          created_at?: string
          is_active?: boolean
        }
        Update: {
          id?: string
          email?: string
          full_name?: string
          phone?: string | null
          created_at?: string
          is_active?: boolean
        }
      }
      properties: {
        Row: {
          id: string
          owner_id: string
          title: string
          description: string
          price: number
          address: string
          distance_min: number
          type: string
          status: 'disponible' | 'pris' | 'suspendu'
          bedrooms: number
          bathrooms: number
          surface: number
          furnished: boolean
          utilities: string
          services: string[]
          image_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          owner_id: string
          title: string
          description: string
          price: number
          address: string
          distance_min: number
          type: string
          status?: 'disponible' | 'pris' | 'suspendu'
          bedrooms?: number
          bathrooms?: number
          surface?: number
          furnished?: boolean
          utilities?: string
          services?: string[]
          image_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          owner_id?: string
          title?: string
          description?: string
          price?: number
          address?: string
          distance_min?: number
          type?: string
          status?: 'disponible' | 'pris' | 'suspendu'
          bedrooms?: number
          bathrooms?: number
          surface?: number
          furnished?: boolean
          utilities?: string
          services?: string[]
          image_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      property_images: {
        Row: {
          id: string
          property_id: string
          image_url: string
          display_order: number
          created_at: string
        }
        Insert: {
          id?: string
          property_id: string
          image_url: string
          display_order?: number
          created_at?: string
        }
        Update: {
          id?: string
          property_id?: string
          image_url?: string
          display_order?: number
          created_at?: string
        }
      }
      contact_messages: {
        Row: {
          id: string
          property_id: string
          owner_id: string
          sender_id: string | null
          sender_name: string
          sender_email: string
          message: string
          status: 'new' | 'read' | 'archived'
          created_at: string
        }
        Insert: {
          id?: string
          property_id: string
          owner_id: string
          sender_id?: string | null
          sender_name: string
          sender_email: string
          message: string
          status?: 'new' | 'read' | 'archived'
          created_at?: string
        }
        Update: {
          id?: string
          property_id?: string
          owner_id?: string
          sender_id?: string | null
          sender_name?: string
          sender_email?: string
          message?: string
          status?: 'new' | 'read' | 'archived'
          created_at?: string
        }
      }
      favorites: {
        Row: {
          id: string
          property_id: string
          user_id: string
          created_at: string
        }
        Insert: {
          id?: string
          property_id: string
          user_id: string
          created_at?: string
        }
        Update: {
          id?: string
          property_id?: string
          user_id?: string
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}

export type Owner = Database['public']['Tables']['owners']['Row'];
export type Property = Database['public']['Tables']['properties']['Row'];
export type PropertyInsert = Database['public']['Tables']['properties']['Insert'];
export type PropertyUpdate = Database['public']['Tables']['properties']['Update'];
export type PropertyImage = Database['public']['Tables']['property_images']['Row'];
export type PropertyImageInsert = Database['public']['Tables']['property_images']['Insert'];
export type ContactMessage = Database['public']['Tables']['contact_messages']['Row'];
export type ContactMessageInsert = Database['public']['Tables']['contact_messages']['Insert'];
export type ContactMessageUpdate = Database['public']['Tables']['contact_messages']['Update'];
export type Favorite = Database['public']['Tables']['favorites']['Row'];