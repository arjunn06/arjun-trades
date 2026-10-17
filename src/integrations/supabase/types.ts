export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      arena_registrations: {
        Row: {
          created_at: string
          discord: string
          email: string
          id: string
          journey: string | null
          name: string
          status: string
          utr: string
        }
        Insert: {
          created_at?: string
          discord: string
          email: string
          id?: string
          journey?: string | null
          name: string
          status?: string
          utr: string
        }
        Update: {
          created_at?: string
          discord?: string
          email?: string
          id?: string
          journey?: string | null
          name?: string
          status?: string
          utr?: string
        }
        Relationships: []
      }
      blog_sessions: {
        Row: {
          blog_id: string
          created_at: string
          duration_seconds: number | null
          id: string
          session_start: string
        }
        Insert: {
          blog_id: string
          created_at?: string
          duration_seconds?: number | null
          id?: string
          session_start?: string
        }
        Update: {
          blog_id?: string
          created_at?: string
          duration_seconds?: number | null
          id?: string
          session_start?: string
        }
        Relationships: [
          {
            foreignKeyName: "blog_sessions_blog_id_fkey"
            columns: ["blog_id"]
            isOneToOne: false
            referencedRelation: "blogs"
            referencedColumns: ["id"]
          },
        ]
      }
      blog_views: {
        Row: {
          blog_id: string
          created_at: string
          id: string
          viewer_ip: string | null
        }
        Insert: {
          blog_id: string
          created_at?: string
          id?: string
          viewer_ip?: string | null
        }
        Update: {
          blog_id?: string
          created_at?: string
          id?: string
          viewer_ip?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "blog_views_blog_id_fkey"
            columns: ["blog_id"]
            isOneToOne: false
            referencedRelation: "blogs"
            referencedColumns: ["id"]
          },
        ]
      }
      blogs: {
        Row: {
          author_id: string
          content: string
          cover_image_url: string | null
          created_at: string
          id: string
          published: boolean
          title: string
          updated_at: string
        }
        Insert: {
          author_id: string
          content: string
          cover_image_url?: string | null
          created_at?: string
          id?: string
          published?: boolean
          title: string
          updated_at?: string
        }
        Update: {
          author_id?: string
          content?: string
          cover_image_url?: string | null
          created_at?: string
          id?: string
          published?: boolean
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      contact_submissions: {
        Row: {
          created_at: string
          email: string
          id: string
          message: string
          name: string
          read: boolean
          subject: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          message: string
          name: string
          read?: boolean
          subject: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          message?: string
          name?: string
          read?: boolean
          subject?: string
        }
        Relationships: []
      }
      livestream_recap_days: {
        Row: {
          day: string
          prompt_message_id: string | null
          public_message_id: string | null
          status: string
          updated_at: string
        }
        Insert: {
          day: string
          prompt_message_id?: string | null
          public_message_id?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          day?: string
          prompt_message_id?: string | null
          public_message_id?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      livestream_results: {
        Row: {
          created_at: string
          entry_date: string
          id: string
          label: string | null
          losses: number
          source: string
          wins: number
        }
        Insert: {
          created_at?: string
          entry_date?: string
          id?: string
          label?: string | null
          losses?: number
          source?: string
          wins?: number
        }
        Update: {
          created_at?: string
          entry_date?: string
          id?: string
          label?: string | null
          losses?: number
          source?: string
          wins?: number
        }
        Relationships: []
      }
      red_pill_bookings: {
        Row: {
          contact: string
          created_at: string
          id: string
          name: string
          preferred_date: string
          preferred_time: string
          read: boolean
          trading_experience: string
        }
        Insert: {
          contact: string
          created_at?: string
          id?: string
          name: string
          preferred_date: string
          preferred_time: string
          read?: boolean
          trading_experience: string
        }
        Update: {
          contact?: string
          created_at?: string
          id?: string
          name?: string
          preferred_date?: string
          preferred_time?: string
          read?: boolean
          trading_experience?: string
        }
        Relationships: []
      }
      red_pill_info: {
        Row: {
          class_time: string
          created_at: string
          email: string
          id: string
          learning_preferences: string[]
          name: string
          read: boolean
          trading_experience: string
        }
        Insert: {
          class_time: string
          created_at?: string
          email: string
          id?: string
          learning_preferences?: string[]
          name: string
          read?: boolean
          trading_experience: string
        }
        Update: {
          class_time?: string
          created_at?: string
          email?: string
          id?: string
          learning_preferences?: string[]
          name?: string
          read?: boolean
          trading_experience?: string
        }
        Relationships: []
      }
      red_pill_reviews: {
        Row: {
          approved: boolean
          created_at: string
          id: string
          name: string
          rating: number
          review: string
        }
        Insert: {
          approved?: boolean
          created_at?: string
          id?: string
          name: string
          rating: number
          review: string
        }
        Update: {
          approved?: boolean
          created_at?: string
          id?: string
          name?: string
          rating?: number
          review?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      workshop_feedback: {
        Row: {
          created_at: string
          feedback: string
          id: string
          name: string
          rating: number
        }
        Insert: {
          created_at?: string
          feedback: string
          id?: string
          name: string
          rating: number
        }
        Update: {
          created_at?: string
          feedback?: string
          id?: string
          name?: string
          rating?: number
        }
        Relationships: []
      }
      workshop_interest: {
        Row: {
          created_at: string
          email: string
          id: string
          name: string
          promo_consent: boolean
          read: boolean
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          name: string
          promo_consent?: boolean
          read?: boolean
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          name?: string
          promo_consent?: boolean
          read?: boolean
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      arena_stats: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      livestream_record: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      livestream_replace_day: {
        Args: { p_date: string; p_losses: number; p_source?: string; p_wins: number }
        Returns: undefined
      }
    }
    Enums: {
      app_role: "admin" | "user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "user"],
    },
  },
} as const
