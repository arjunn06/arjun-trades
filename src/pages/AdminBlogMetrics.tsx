import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Eye, Clock, TrendingUp, Users } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

interface BlogInfo {
  id: string;
  title: string;
  published: boolean;
  created_at: string;
}

interface DailyViews {
  date: string;
  views: number;
}

const AdminBlogMetrics = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState<BlogInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [totalViews, setTotalViews] = useState(0);
  const [uniqueVisitors, setUniqueVisitors] = useState(0);
  const [avgDuration, setAvgDuration] = useState(0);
  const [dailyViews, setDailyViews] = useState<DailyViews[]>([]);

  useEffect(() => {
    const checkAndFetch = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { navigate("/admin"); return; }
      const { data: roles } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .eq("role", "admin");
      if (!roles || roles.length === 0) { navigate("/admin"); return; }

      // Fetch blog info
      const { data: blogData } = await supabase
        .from("blogs")
        .select("id, title, published, created_at")
        .eq("id", id)
        .single();
      setBlog(blogData);

      if (!blogData) { setLoading(false); return; }

      // Fetch views
      const { data: views } = await supabase
        .from("blog_views")
        .select("created_at, viewer_ip")
        .eq("blog_id", id!);

      const viewsList = views || [];
      setTotalViews(viewsList.length);

      // Unique visitors by IP
      const uniqueIps = new Set(viewsList.map(v => v.viewer_ip).filter(Boolean));
      setUniqueVisitors(uniqueIps.size || viewsList.length);

      // Daily views for chart (last 30 days)
      const now = new Date();
      const thirtyDaysAgo = new Date(now);
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 29);

      const dailyMap: Record<string, number> = {};
      for (let i = 0; i < 30; i++) {
        const d = new Date(thirtyDaysAgo);
        d.setDate(d.getDate() + i);
        dailyMap[d.toISOString().split("T")[0]] = 0;
      }
      viewsList.forEach(v => {
        const day = v.created_at.split("T")[0];
        if (dailyMap[day] !== undefined) dailyMap[day]++;
      });
      setDailyViews(Object.entries(dailyMap).map(([date, views]) => ({
        date: new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        views,
      })));

      // Fetch sessions for avg duration
      const { data: sessions } = await supabase
        .from("blog_sessions")
        .select("duration_seconds")
        .eq("blog_id", id!)
        .not("duration_seconds", "is", null);

      const sessionsList = sessions || [];
      if (sessionsList.length > 0) {
        const total = sessionsList.reduce((sum, s) => sum + (s.duration_seconds || 0), 0);
        setAvgDuration(Math.round(total / sessionsList.length));
      }

      setLoading(false);
    };
    checkAndFetch();
  }, [id]);

  const formatDuration = (seconds: number) => {
    if (seconds < 60) return `${seconds}s`;
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-4xl mx-auto px-6 py-20 animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/2" />
          <div className="grid grid-cols-4 gap-4 mt-8">
            {[1, 2, 3, 4].map(i => <div key={i} className="h-24 bg-muted rounded-xl" />)}
          </div>
          <div className="h-64 bg-muted rounded-xl mt-8" />
        </div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Blog not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50">
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center gap-4">
          <button
            onClick={() => navigate("/admin/blogs")}
            className="p-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="min-w-0">
            <h1 className="font-display font-bold text-lg text-foreground truncate">{blog.title}</h1>
            <p className="text-xs text-muted-foreground">
              {blog.published ? "Published" : "Draft"} · {new Date(blog.created_at).toLocaleDateString()}
            </p>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Key Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="p-4 rounded-xl border border-border bg-card">
            <div className="flex items-center gap-2 text-muted-foreground mb-2">
              <Eye className="w-4 h-4" />
              <span className="text-xs">Total Views</span>
            </div>
            <p className="text-2xl font-bold text-foreground">{totalViews}</p>
          </div>
          <div className="p-4 rounded-xl border border-border bg-card">
            <div className="flex items-center gap-2 text-muted-foreground mb-2">
              <Users className="w-4 h-4" />
              <span className="text-xs">Unique Visitors</span>
            </div>
            <p className="text-2xl font-bold text-foreground">{uniqueVisitors}</p>
          </div>
          <div className="p-4 rounded-xl border border-border bg-card">
            <div className="flex items-center gap-2 text-muted-foreground mb-2">
              <Clock className="w-4 h-4" />
              <span className="text-xs">Avg. Time on Page</span>
            </div>
            <p className="text-2xl font-bold text-foreground">{avgDuration > 0 ? formatDuration(avgDuration) : "—"}</p>
          </div>
          <div className="p-4 rounded-xl border border-border bg-card">
            <div className="flex items-center gap-2 text-muted-foreground mb-2">
              <TrendingUp className="w-4 h-4" />
              <span className="text-xs">Views Today</span>
            </div>
            <p className="text-2xl font-bold text-foreground">
              {dailyViews.length > 0 ? dailyViews[dailyViews.length - 1].views : 0}
            </p>
          </div>
        </div>

        {/* Views Chart */}
        <div className="p-6 rounded-xl border border-border bg-card">
          <h2 className="font-display font-semibold text-foreground mb-6">Views · Last 30 Days</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dailyViews}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                  interval={4}
                />
                <YAxis
                  allowDecimals={false}
                  tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                />
                <Tooltip
                  contentStyle={{
                    background: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                    color: "hsl(var(--foreground))",
                  }}
                />
                <Bar dataKey="views" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminBlogMetrics;
