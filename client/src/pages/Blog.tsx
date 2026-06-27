/**
 * Blog Page - SEO-targeted content hub
 * Design: Warm Guidance - editorial layout
 * Keywords: 경계선 지능 테스트, 경계선 지능 증상, 아이 지능 검사
 */
import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowLeft, BookOpen, Clock, ArrowRight, Brain } from "lucide-react";
import { blogPosts, blogCategories } from "@/lib/blogData";

export default function Blog() {
  const [activeCategory, setActiveCategory] = useState("전체");

  const filtered = activeCategory === "전체"
    ? blogPosts
    : blogPosts.filter(p => p.category === activeCategory);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/90 backdrop-blur-md border-b border-border/50">
        <div className="container flex items-center justify-between h-14">
          <Link href="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">홈으로</span>
          </Link>
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-primary" />
            <span className="text-sm font-medium text-foreground">정보 센터</span>
          </div>
          <div />
        </div>
      </header>

      <main className="container max-w-4xl py-10 md:py-16">
        {/* Page Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-10"
        >
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-3">
            경계선 지능 정보 센터
          </h1>
          <p className="text-muted-foreground leading-relaxed max-w-xl">
            경계선 지능에 대한 신뢰할 수 있는 정보를 제공합니다.
            증상, 지원 제도, 부모 가이드 등 다양한 주제를 다룹니다.
          </p>
        </motion.div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 mb-8">
          {blogCategories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
                activeCategory === cat
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-muted-foreground hover:bg-secondary/80 hover:text-foreground"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Post Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filtered.map((post, i) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
            >
              <Link href={`/blog/${post.slug}`}>
                <div className="group bg-card rounded-xl border border-border/50 p-6 hover:shadow-md transition-all duration-300 h-full flex flex-col">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xs font-medium text-primary bg-primary/10 px-2.5 py-1 rounded-full">
                      {post.category}
                    </span>
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {post.readTime}
                    </span>
                  </div>
                  <h2 className="text-lg font-serif font-bold text-foreground mb-2 group-hover:text-primary transition-colors leading-snug">
                    {post.title}
                  </h2>
                  <p className="text-sm text-muted-foreground leading-relaxed flex-1 mb-4">
                    {post.description}
                  </p>
                  <div className="flex items-center justify-between mt-auto">
                    <span className="text-xs text-muted-foreground">
                      {new Date(post.publishedAt).toLocaleDateString("ko-KR")}
                    </span>
                    <span className="text-xs text-primary font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                      읽기 <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* CTA Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mt-14 bg-primary/5 border border-primary/20 rounded-xl p-8 flex flex-col md:flex-row items-center gap-6"
        >
          <Brain className="w-12 h-12 text-primary shrink-0" />
          <div className="flex-1 text-center md:text-left">
            <h3 className="text-xl font-serif font-bold text-foreground mb-2">
              지금 바로 선별검사를 해보세요
            </h3>
            <p className="text-sm text-muted-foreground">
              약 5~10분으로 학습·인지·적응기능 어려움 가능성을 점검할 수 있습니다.
            </p>
          </div>
          <div className="flex gap-3 shrink-0">
            <Link href="/test/adult">
              <Button className="bg-primary text-primary-foreground">성인 검사</Button>
            </Link>
            <Link href="/test/child">
              <Button variant="outline">아동 검사</Button>
            </Link>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
