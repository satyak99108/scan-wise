import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

function Home() {
  return (
    <div style={{ paddingTop: '64px' }}>
      
      {/* ─── Brutal Marquee Top ─── */}
      <div className="marquee-container" style={{ background: 'var(--accent)', color: 'var(--bg)', borderTop: 'none' }}>
        <div className="marquee-content grotesk" style={{ fontSize: '1.2rem', fontWeight: 600 }}>
          {Array(10).fill("WARNING: KNOW YOUR INGREDIENTS /// ").map((text, i) => (
            <span key={i} style={{ paddingRight: '20px' }}>{text}</span>
          ))}
        </div>
      </div>

      {/* ─── Hero Section ─── */}
      <section style={{ 
        minHeight: '80vh', 
        display: 'flex', 
        flexDirection: 'column',
        alignItems: 'flex-start', 
        justifyContent: 'center',
        padding: '0 5%',
        borderBottom: '1px solid var(--border)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Background Grid Accent */}
        <div style={{ position: 'absolute', right: '-10%', top: '10%', width: '600px', height: '600px', border: '1px solid var(--border)', borderRadius: '50%', opacity: 0.2 }} />
        <div style={{ position: 'absolute', right: '0%', top: '20%', width: '400px', height: '400px', border: '1px solid var(--border)', borderRadius: '50%', opacity: 0.2 }} />

        <div style={{ zIndex: 10 }}>
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: 'auto' }}
            transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
            style={{ overflow: 'hidden' }}
          >
            <h1 className="grotesk" style={{ fontSize: 'clamp(4rem, 12vw, 10rem)', fontWeight: 700, lineHeight: 0.9, letterSpacing: '-0.06em', color: 'var(--fg)', marginBottom: '24px' }}>
              CONSUME <br/>
              <span style={{ color: 'var(--bg)', WebkitTextStroke: '2px var(--fg)' }}>WISELY.</span>
            </h1>
          </motion.div>

          <motion.p 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            style={{ fontSize: '1.2rem', maxWidth: '500px', marginBottom: '48px', lineHeight: 1.5, borderLeft: '4px solid var(--accent)', paddingLeft: '16px' }}
          >
            Raw intelligence extraction for product ingredients. We shred corporate nomenclature to expose exactly what enters your body.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <Link to="/analyze" className="brutal-button" style={{ textDecoration: 'none' }}>
              [ INITIALIZE SCANNER ]
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ─── Grid Features ─── */}
      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
        {[
          { num: '01', title: 'DETECT', desc: 'Scan matrices to isolate toxic components.' },
          { num: '02', title: 'TRANSLATE', desc: 'Convert chemical synonyms into standard readable facts.' },
          { num: '03', title: 'DECIDE', desc: 'Actionable intelligence to prevent consumption errors.' }
        ].map((feature, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className="brutal-box"
            style={{ padding: '60px 40px', borderTop: 'none', borderLeft: i !== 0 ? 'none' : '1px solid var(--border)' }}
          >
            <div className="grotesk" style={{ fontSize: '4rem', fontWeight: 700, color: 'var(--accent)', marginBottom: '24px', lineHeight: 1 }}>{feature.num}</div>
            <h3 className="grotesk" style={{ fontSize: '2rem', fontWeight: 600, marginBottom: '16px' }}>{feature.title}</h3>
            <p style={{ color: '#a1a1aa', fontSize: '1.1rem', lineHeight: 1.5 }}>{feature.desc}</p>
          </motion.div>
        ))}
      </section>

      {/* ─── Bottom CTA ─── */}
      <section style={{ padding: '120px 5%', borderTop: '1px solid var(--border)', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', background: 'var(--fg)', color: 'var(--bg)' }}>
        <h2 className="grotesk" style={{ fontSize: 'clamp(3rem, 8vw, 6rem)', fontWeight: 700, lineHeight: 1, marginBottom: '40px' }}>
          STOP GUESSING.
        </h2>
        <Link to="/analyze" className="brutal-button" style={{ textDecoration: 'none', background: 'var(--bg)', color: 'var(--fg)' }}>
          UPLOAD IMAGE
        </Link>
      </section>

    </div>
  );
}

export default Home;
