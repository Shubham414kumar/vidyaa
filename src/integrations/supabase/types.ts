// export type Json =
//   | string
//   | number
//   | boolean
//   | null
//   | { [key: string]: Json | undefined }
//   | Json[]

// export type Database = {
//   // Allows to automatically instantiate createClient with right options
//   // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
//   __InternalSupabase: {
//     PostgrestVersion: "13.0.4"
//   }
//   public: {
//     Tables: {
//       assignments: {
//         Row: {
//           course_id: string
//           created_at: string
//           description: string | null
//           due_date: string | null
//           id: string
//           max_points: number | null
//           title: string
//           updated_at: string
//         }
//         Insert: {
//           course_id: string
//           created_at?: string
//           description?: string | null
//           due_date?: string | null
//           id?: string
//           max_points?: number | null
//           title: string
//           updated_at?: string
//         }
//         Update: {
//           course_id?: string
//           created_at?: string
//           description?: string | null
//           due_date?: string | null
//           id?: string
//           max_points?: number | null
//           title?: string
//           updated_at?: string
//         }
//         Relationships: [
//           {
//             foreignKeyName: "assignments_course_id_fkey"
//             columns: ["course_id"]
//             isOneToOne: false
//             referencedRelation: "courses"
//             referencedColumns: ["id"]
//           },
//         ]
//       }
//       courses: {
//         Row: {
//           category: string | null
//           created_at: string
//           description: string | null
//           duration_hours: number | null
//           id: string
//           instructor_id: string
//           is_published: boolean | null
//           level: string | null
//           price: number | null
//           thumbnail_url: string | null
//           title: string
//           updated_at: string
//           video_trailer_url: string | null
//         }
//         Insert: {
//           category?: string | null
//           created_at?: string
//           description?: string | null
//           duration_hours?: number | null
//           id?: string
//           instructor_id: string
//           is_published?: boolean | null
//           level?: string | null
//           price?: number | null
//           thumbnail_url?: string | null
//           title: string
//           updated_at?: string
//           video_trailer_url?: string | null
//         }
//         Update: {
//           category?: string | null
//           created_at?: string
//           description?: string | null
//           duration_hours?: number | null
//           id?: string
//           instructor_id?: string
//           is_published?: boolean | null
//           level?: string | null
//           price?: number | null
//           thumbnail_url?: string | null
//           title?: string
//           updated_at?: string
//           video_trailer_url?: string | null
//         }
//         Relationships: [
//           {
//             foreignKeyName: "courses_instructor_id_fkey"
//             columns: ["instructor_id"]
//             isOneToOne: false
//             referencedRelation: "profiles"
//             referencedColumns: ["id"]
//           },
//         ]
//       }
//       discussions: {
//         Row: {
//           content: string
//           course_id: string
//           created_at: string
//           id: string
//           parent_id: string | null
//           title: string | null
//           updated_at: string
//           user_id: string
//         }
//         Insert: {
//           content: string
//           course_id: string
//           created_at?: string
//           id?: string
//           parent_id?: string | null
//           title?: string | null
//           updated_at?: string
//           user_id: string
//         }
//         Update: {
//           content?: string
//           course_id?: string
//           created_at?: string
//           id?: string
//           parent_id?: string | null
//           title?: string | null
//           updated_at?: string
//           user_id?: string
//         }
//         Relationships: [
//           {
//             foreignKeyName: "discussions_course_id_fkey"
//             columns: ["course_id"]
//             isOneToOne: false
//             referencedRelation: "courses"
//             referencedColumns: ["id"]
//           },
//           {
//             foreignKeyName: "discussions_parent_id_fkey"
//             columns: ["parent_id"]
//             isOneToOne: false
//             referencedRelation: "discussions"
//             referencedColumns: ["id"]
//           },
//           {
//             foreignKeyName: "discussions_user_id_fkey"
//             columns: ["user_id"]
//             isOneToOne: false
//             referencedRelation: "profiles"
//             referencedColumns: ["id"]
//           },
//         ]
//       }
//       enrollments: {
//         Row: {
//           completed_at: string | null
//           course_id: string
//           enrolled_at: string
//           id: string
//           progress: number | null
//           student_id: string
//         }
//         Insert: {
//           completed_at?: string | null
//           course_id: string
//           enrolled_at?: string
//           id?: string
//           progress?: number | null
//           student_id: string
//         }
//         Update: {
//           completed_at?: string | null
//           course_id?: string
//           enrolled_at?: string
//           id?: string
//           progress?: number | null
//           student_id?: string
//         }
//         Relationships: [
//           {
//             foreignKeyName: "enrollments_course_id_fkey"
//             columns: ["course_id"]
//             isOneToOne: false
//             referencedRelation: "courses"
//             referencedColumns: ["id"]
//           },
//           {
//             foreignKeyName: "enrollments_student_id_fkey"
//             columns: ["student_id"]
//             isOneToOne: false
//             referencedRelation: "profiles"
//             referencedColumns: ["id"]
//           },
//         ]
//       }
//       lessons: {
//         Row: {
//           content: string | null
//           course_id: string
//           created_at: string
//           duration_minutes: number | null
//           id: string
//           is_preview: boolean | null
//           order_index: number
//           title: string
//           updated_at: string
//           video_url: string | null
//         }
//         Insert: {
//           content?: string | null
//           course_id: string
//           created_at?: string
//           duration_minutes?: number | null
//           id?: string
//           is_preview?: boolean | null
//           order_index: number
//           title: string
//           updated_at?: string
//           video_url?: string | null
//         }
//         Update: {
//           content?: string | null
//           course_id?: string
//           created_at?: string
//           duration_minutes?: number | null
//           id?: string
//           is_preview?: boolean | null
//           order_index?: number
//           title?: string
//           updated_at?: string
//           video_url?: string | null
//         }
//         Relationships: [
//           {
//             foreignKeyName: "lessons_course_id_fkey"
//             columns: ["course_id"]
//             isOneToOne: false
//             referencedRelation: "courses"
//             referencedColumns: ["id"]
//           },
//         ]
//       }
//       profiles: {
//         Row: {
//           avatar_url: string | null
//           bio: string | null
//           created_at: string
//           full_name: string | null
//           id: string
//           role: string | null
//           updated_at: string
//           user_id: string
//         }
//         Insert: {
//           avatar_url?: string | null
//           bio?: string | null
//           created_at?: string
//           full_name?: string | null
//           id?: string
//           role?: string | null
//           updated_at?: string
//           user_id: string
//         }
//         Update: {
//           avatar_url?: string | null
//           bio?: string | null
//           created_at?: string
//           full_name?: string | null
//           id?: string
//           role?: string | null
//           updated_at?: string
//           user_id?: string
//         }
//         Relationships: []
//       }
//       submissions: {
//         Row: {
//           assignment_id: string
//           content: string | null
//           file_url: string | null
//           graded_at: string | null
//           id: string
//           points_earned: number | null
//           student_id: string
//           submitted_at: string
//         }
//         Insert: {
//           assignment_id: string
//           content?: string | null
//           file_url?: string | null
//           graded_at?: string | null
//           id?: string
//           points_earned?: number | null
//           student_id: string
//           submitted_at?: string
//         }
//         Update: {
//           assignment_id?: string
//           content?: string | null
//           file_url?: string | null
//           graded_at?: string | null
//           id?: string
//           points_earned?: number | null
//           student_id?: string
//           submitted_at?: string
//         }
//         Relationships: [
//           {
//             foreignKeyName: "submissions_assignment_id_fkey"
//             columns: ["assignment_id"]
//             isOneToOne: false
//             referencedRelation: "assignments"
//             referencedColumns: ["id"]
//           },
//           {
//             foreignKeyName: "submissions_student_id_fkey"
//             columns: ["student_id"]
//             isOneToOne: false
//             referencedRelation: "profiles"
//             referencedColumns: ["id"]
//           },
//         ]
//       }
//     }
//     Views: {
//       [_ in never]: never
//     }
//     Functions: {
//       [_ in never]: never
//     }
//     Enums: {
//       [_ in never]: never
//     }
//     CompositeTypes: {
//       [_ in never]: never
//     }
//   }
// }

// type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

// type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

// export type Tables<
//   DefaultSchemaTableNameOrOptions extends
//     | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
//     | { schema: keyof DatabaseWithoutInternals },
//   TableName extends DefaultSchemaTableNameOrOptions extends {
//     schema: keyof DatabaseWithoutInternals
//   }
//     ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
//         DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
//     : never = never,
// > = DefaultSchemaTableNameOrOptions extends {
//   schema: keyof DatabaseWithoutInternals
// }
//   ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
//       DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
//       Row: infer R
//     }
//     ? R
//     : never
//   : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
//         DefaultSchema["Views"])
//     ? (DefaultSchema["Tables"] &
//         DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
//         Row: infer R
//       }
//       ? R
//       : never
//     : never

// export type TablesInsert<
//   DefaultSchemaTableNameOrOptions extends
//     | keyof DefaultSchema["Tables"]
//     | { schema: keyof DatabaseWithoutInternals },
//   TableName extends DefaultSchemaTableNameOrOptions extends {
//     schema: keyof DatabaseWithoutInternals
//   }
//     ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
//     : never = never,
// > = DefaultSchemaTableNameOrOptions extends {
//   schema: keyof DatabaseWithoutInternals
// }
//   ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
//       Insert: infer I
//     }
//     ? I
//     : never
//   : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
//     ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
//         Insert: infer I
//       }
//       ? I
//       : never
//     : never

// export type TablesUpdate<
//   DefaultSchemaTableNameOrOptions extends
//     | keyof DefaultSchema["Tables"]
//     | { schema: keyof DatabaseWithoutInternals },
//   TableName extends DefaultSchemaTableNameOrOptions extends {
//     schema: keyof DatabaseWithoutInternals
//   }
//     ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
//     : never = never,
// > = DefaultSchemaTableNameOrOptions extends {
//   schema: keyof DatabaseWithoutInternals
// }
//   ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
//       Update: infer U
//     }
//     ? U
//     : never
//   : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
//     ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
//         Update: infer U
//       }
//       ? U
//       : never
//     : never

// export type Enums<
//   DefaultSchemaEnumNameOrOptions extends
//     | keyof DefaultSchema["Enums"]
//     | { schema: keyof DatabaseWithoutInternals },
//   EnumName extends DefaultSchemaEnumNameOrOptions extends {
//     schema: keyof DatabaseWithoutInternals
//   }
//     ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
//     : never = never,
// > = DefaultSchemaEnumNameOrOptions extends {
//   schema: keyof DatabaseWithoutInternals
// }
//   ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
//   : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
//     ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
//     : never

// export type CompositeTypes<
//   PublicCompositeTypeNameOrOptions extends
//     | keyof DefaultSchema["CompositeTypes"]
//     | { schema: keyof DatabaseWithoutInternals },
//   CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
//     schema: keyof DatabaseWithoutInternals
//   }
//     ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
//     : never = never,
// > = PublicCompositeTypeNameOrOptions extends {
//   schema: keyof DatabaseWithoutInternals
// }
//   ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
//   : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
//     ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
//     : never

// export const Constants = {
//   public: {
//     Enums: {},
//   },
// } as const
