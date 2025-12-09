export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type AssetStatus = 'active' | 'sold' | 'broken' | 'disposed';
export type AssetCondition = 'excellent' | 'good' | 'fair' | 'poor';
export type ServiceStatus = 'process' | 'completed';
export type ImageType = 'asset' | 'service' | 'receipt';

export interface Database {
  public: {
    Tables: {
      assets: {
        Row: {
          id: string;
          name: string;
          category: string;
          brand: string | null;
          model: string | null;
          serial_number: string | null;
          location: string | null;
          purchase_date: string | null;
          purchase_price: number;
          condition: AssetCondition;
          status: AssetStatus;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          category: string;
          brand?: string | null;
          model?: string | null;
          serial_number?: string | null;
          location?: string | null;
          purchase_date?: string | null;
          purchase_price?: number;
          condition?: AssetCondition;
          status?: AssetStatus;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          category?: string;
          brand?: string | null;
          model?: string | null;
          serial_number?: string | null;
          location?: string | null;
          purchase_date?: string | null;
          purchase_price?: number;
          condition?: AssetCondition;
          status?: AssetStatus;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      warranties: {
        Row: {
          id: string;
          asset_id: string;
          warranty_start: string;
          warranty_end: string;
          provider: string | null;
          notes: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          asset_id: string;
          warranty_start: string;
          warranty_end: string;
          provider?: string | null;
          notes?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          asset_id?: string;
          warranty_start?: string;
          warranty_end?: string;
          provider?: string | null;
          notes?: string | null;
          created_at?: string;
        };
      };
      services: {
        Row: {
          id: string;
          asset_id: string;
          service_date: string;
          problem_description: string | null;
          repair_action: string | null;
          service_place: string | null;
          cost: number;
          status: ServiceStatus;
          created_at: string;
        };
        Insert: {
          id?: string;
          asset_id: string;
          service_date: string;
          problem_description?: string | null;
          repair_action?: string | null;
          service_place?: string | null;
          cost?: number;
          status?: ServiceStatus;
          created_at?: string;
        };
        Update: {
          id?: string;
          asset_id?: string;
          service_date?: string;
          problem_description?: string | null;
          repair_action?: string | null;
          service_place?: string | null;
          cost?: number;
          status?: ServiceStatus;
          created_at?: string;
        };
      };
      asset_sales: {
        Row: {
          id: string;
          asset_id: string;
          sold_date: string;
          sold_price: number;
          buyer_name: string | null;
          profit_loss: number | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          asset_id: string;
          sold_date: string;
          sold_price: number;
          buyer_name?: string | null;
          profit_loss?: number | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          asset_id?: string;
          sold_date?: string;
          sold_price?: number;
          buyer_name?: string | null;
          profit_loss?: number | null;
          created_at?: string;
        };
      };
      asset_images: {
        Row: {
          id: string;
          asset_id: string;
          image_url: string;
          image_type: ImageType;
          created_at: string;
        };
        Insert: {
          id?: string;
          asset_id: string;
          image_url: string;
          image_type?: ImageType;
          created_at?: string;
        };
        Update: {
          id?: string;
          asset_id?: string;
          image_url?: string;
          image_type?: ImageType;
          created_at?: string;
        };
      };
    };
  };
}

// Helper types for joins
export type Asset = Database['public']['Tables']['assets']['Row'];
export type AssetInsert = Database['public']['Tables']['assets']['Insert'];
export type AssetUpdate = Database['public']['Tables']['assets']['Update'];

export type Warranty = Database['public']['Tables']['warranties']['Row'];
export type WarrantyInsert = Database['public']['Tables']['warranties']['Insert'];
export type WarrantyUpdate = Database['public']['Tables']['warranties']['Update'];

export type Service = Database['public']['Tables']['services']['Row'];
export type ServiceInsert = Database['public']['Tables']['services']['Insert'];
export type ServiceUpdate = Database['public']['Tables']['services']['Update'];

export type AssetSale = Database['public']['Tables']['asset_sales']['Row'];
export type AssetSaleInsert = Database['public']['Tables']['asset_sales']['Insert'];
export type AssetSaleUpdate = Database['public']['Tables']['asset_sales']['Update'];

export type AssetImage = Database['public']['Tables']['asset_images']['Row'];
export type AssetImageInsert = Database['public']['Tables']['asset_images']['Insert'];
export type AssetImageUpdate = Database['public']['Tables']['asset_images']['Update'];

// Extended types with relations
export interface AssetWithRelations extends Asset {
  warranty?: Warranty | null;
  services?: Service[];
  sale?: AssetSale | null;
  images?: AssetImage[];
}

export interface WarrantyWithAsset extends Warranty {
  asset?: Asset;
}

export interface ServiceWithAsset extends Service {
  asset?: Asset;
}

export interface SaleWithAsset extends AssetSale {
  asset?: Asset;
}

