/**
 * Blog Post Detail Page - SEO-optimized article page
 * Design: Warm Guidance - clean editorial reading experience
 */
import { useMemo } from "react";
import { Link, useParams } from "wouter";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowLeft, Clock, Tag, ArrowRight, Brain, Heart } from "lucide-react";
import { blogPosts } from "@/lib/blogData";
import { Streamdown } from "streamdown";

export default function BlogPost() {
  const params = useParams<{ slug: string }>();
  const post = useMemo(
    () => blogPosts.find(p => p.slug === params.slug),
    [params.slug]
  );

  const relatedPosts = useMemo(
    () => blogPosts.filter(p => p.id !== post?.id).slice(0, 2),
    [post]
  );

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-serif font-bold text-foreground mb-4">
            게시글을 찾을 수 없습니다
          </h1>
          <Link href="/blog">
            <Button>정보 센터로 돌아가기</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/90 backdrop-blur-md border-b border-border/50">
        <div className="container flex items-center justify-between h-14">
          <Link href="/blog" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">정보 센터</span>
          </Link>
          <div className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-primary" />
            <span className="text-sm font-medium text-foreground">마음이음</span>
          </div>
          <div />
        </div>
      </header>

      <main className="container max-w-2xl py-10 md:py-16">
        {/* Article Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-10"
        >
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xs font-medium text-primary bg-primary/10 px-2.5 py-1 rounded-full">
              {post.category}
            </span>
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <Clock className="w-3 h-3" /> {post.readTime} 읽기
            </span>
            <span className="text-xs text-muted-foreground">
              {new Date(post.publishedAt).toLocaleDateString("ko-KR")}
            </span>
          </div>

          <h1 className="text-2xl md:text-3xl font-serif font-bold text-foreground mb-4 leading-tight">
            {post.title}
          </h1>
          <p className="text-muted-foreground leading-relaxed text-base">
            {post.description}
          </p>

          {/* Keywords */}
          <div className="flex flex-wrap gap-2 mt-5">
            {post.keywords.map(kw => (
              <span key={kw} className="flex items-center gap-1 text-xs text-muted-foreground bg-secondary px-2.5 py-1 rounded-full">
                <Tag className="w-3 h-3" /> {kw}
              </span>
            ))}
          </div>
        </motion.div>

        {/* Divider */}
        <div className="h-px bg-border mb-10" />

        {/* Article Content */}
        <motion.article
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="prose prose-slate max-w-none
            prose-headings:font-serif prose-headings:text-foreground
            prose-h2:text-xl prose-h2:font-bold prose-h2:mt-8 prose-h2:mb-3
            prose-p:text-muted-foreground prose-p:leading-relaxed prose-p:text-[0.95rem]
            prose-strong:text-foreground prose-strong:font-semibold
            prose-ul:text-muted-foreground prose-li:text-[0.95rem]
            prose-table:text-sm
            prose-th:bg-secondary prose-th:text-foreground prose-th:font-semibold
            prose-td:text-muted-foreground
          "
        >
          <Streamdown>{post.content}</Streamdown>
        </motion.article>

        {/* Divider */}
        <div className="h-px bg-border my-10" />

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="bg-primary/5 border border-primary/20 rounded-xl p-6 mb-10"
        >
          <div className="flex items-center gap-2 mb-3">
            <Heart className="w-5 h-5 text-primary" />
            <h3 className="font-serif font-bold text-foreground">지금 바로 확인해보세요</h3>
          </div>
          <p className="text-sm text-muted-foreground mb-4">
            학습·인지·적응기능 어려움 가능성을 간편한 체크리스트로 점검할 수 있습니다.
          </p>
          <div className="flex gap-3">
            <Link href="/test/adult">
              <Button className="bg-primary text-primary-foreground gap-1.5" size="sm">
                성인 자가체크 <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </Link>
            <Link href="/test/child">
              <Button variant="outline" size="sm" className="gap-1.5">
                아동 선별검사 <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </Link>
          </div>
        </motion.div>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <div>
            <h2 className="text-lg font-serif font-bold text-foreground mb-4">관련 글</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {relatedPosts.map(related => (
                <Link key={related.id} href={`/blog/${related.slug}`}>
                  <div className="group p-4 rounded-xl border border-border/50 bg-card hover:shadow-sm transition-all">
                    <span className="text-xs text-primary font-medium">{related.category}</span>
                    <h3 className="text-sm font-semibold text-foreground mt-1 mb-1 group-hover:text-primary transition-colors leading-snug">
                      {related.title}
                    </h3>
                    <p className="text-xs text-muted-foreground line-clamp-2">{related.description}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
