'use client'

import Image from 'next/image'
import { type MouseEvent, useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { FiArrowRight, FiArrowUpRight } from 'react-icons/fi'
import { FaLinkedinIn } from 'react-icons/fa6'
import MatrixRain from './MatrixRain'
import {
  SiExpress, SiGithub, SiJavascript, SiLeetcode, SiMongodb, SiPandas,
  SiPython, SiReact, SiScikitlearn, SiStreamlit, SiTailwindcss,
} from 'react-icons/si'

const projects = [
  {
    number: '01', title: 'Real Estate Prediction', category: 'Machine learning',
    description: 'An interactive property-price estimator built around real housing data.',
    tools: 'Python, Streamlit, pandas, scikit-learn',
    demo: 'https://estate-prediction.streamlit.app/',
    source: 'https://github.com/notJishnu/Real-Estate-Prediction', image: null,
  },
  {
    number: '02', title: 'Eduva', category: 'Full-stack product',
    description: 'A study companion for subjects, focus sessions, streaks, and progress.',
    tools: 'React, Tailwind CSS, Express, MongoDB',
    demo: 'https://edu-va.vercel.app/',
    source: 'https://github.com/notJishnu/Academic-Progress-Tracker', image: '/projects/eduva.png',
  },
  {
    number: '03', title: 'OpenCircle', category: 'Social platform',
    description: 'An anonymous place to meet beyond your usual circle.',
    tools: 'Global rooms, one-to-one matching, direct messages',
    demo: 'https://opencirclechat.vercel.app/', source: null, image: '/projects/opencircle.png',
  },
]

const education = [
  { years: 'NOW', title: 'Master of Computer Applications', place: 'KIIT, Bhubaneswar', detail: '2025–2027 · In progress', grade: '9.29 CGPA' },
  { years: '2025', title: 'Bachelor of Computer Applications', place: 'UEM, Kolkata', detail: '2022–2025', grade: '9.04 CGPA' },
  { years: '2022', title: 'Higher Secondary', place: 'Kalyani University Experimental High School', detail: 'Class 12', grade: '85.89%' },
  { years: '2020', title: 'Secondary', place: 'Kalyani University Experimental High School', detail: 'Class 10', grade: '65.4%' },
]

const skills = [
  { name: 'Python', Icon: SiPython }, { name: 'JavaScript', Icon: SiJavascript },
  { name: 'React', Icon: SiReact }, { name: 'Tailwind', Icon: SiTailwindcss },
  { name: 'Express', Icon: SiExpress }, { name: 'MongoDB', Icon: SiMongodb },
  { name: 'Streamlit', Icon: SiStreamlit }, { name: 'pandas', Icon: SiPandas },
  { name: 'scikit-learn', Icon: SiScikitlearn }, { name: 'GitHub', Icon: SiGithub },
]

export default function Portfolio() {
  const root = useRef<HTMLDivElement>(null)
  const loader = useRef<HTMLDivElement>(null)
  const [progress, setProgress] = useState(0)
  const [loaded, setLoaded] = useState(false)
  const [reducedMotion, setReducedMotion] = useState(false)

  const scrollToTop = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault()
    window.history.replaceState(null, '', '#top')
    window.scrollTo({ top: 0, behavior: reducedMotion ? 'instant' : 'smooth' })
  }

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    setReducedMotion(reduce)
    if (reduce) { setProgress(100); setLoaded(true); return }
    let frame = 0
    const began = performance.now()
    const tick = (now: number) => {
      const fraction = Math.min((now - began) / 1850, 1)
      setProgress(Math.round((1 - Math.pow(1 - fraction, 3)) * 100))
      if (fraction < 1) frame = requestAnimationFrame(tick)
      else gsap.to(loader.current, { yPercent: -100, duration: .95, ease: 'power4.inOut', delay: .2, onComplete: () => setLoaded(true) })
    }
    frame = requestAnimationFrame(tick)
    return () => { cancelAnimationFrame(frame); gsap.killTweensOf(loader.current) }
  }, [])

  useEffect(() => {
    if (!loaded || reducedMotion || !root.current) return
    gsap.registerPlugin(ScrollTrigger)
    const ctx = gsap.context(() => {
      gsap.fromTo('.hero-enter', { autoAlpha: 0, y: 32, filter: 'blur(8px)' }, { autoAlpha: 1, y: 0, filter: 'blur(0px)', stagger: .12, duration: 1.05, ease: 'power3.out' })
      const desktop = gsap.matchMedia()
      const createHeroZoom = (scrollScreens: number, zoom: number) => {
        gsap.timeline({ scrollTrigger: { trigger: '.hero', start: 'top top', end: () => `+=${window.innerHeight * scrollScreens}`, pin: true, scrub: .45, invalidateOnRefresh: true } })
          .to('.hero-copy, .hero-down', { autoAlpha: 0, y: -45, duration: .2, ease: 'none' }, 0)
          .to('.matrix-hint', { autoAlpha: 0, duration: .16, ease: 'none' }, 0)
          .to('.matrix-word', { autoAlpha: 0, duration: .25, ease: 'none' }, .3)
          .to('.matrix-position', { scale: zoom, duration: .82, ease: 'none' }, 0)
          .to('.matrix-position', { autoAlpha: 0, duration: .19, ease: 'none' }, .73)
      }
      const createScrollMotion = () => {
        desktop.add('(min-width: 900px)', () => {
          createHeroZoom(1.2, 6.5)
          const work = document.querySelector<HTMLElement>('.work-section')!
          const track = document.querySelector<HTMLElement>('.project-track')!
          const distance = () => Math.max(0, track.scrollWidth - work.clientWidth + 40)
          gsap.to(track, {
            x: () => -distance(), ease: 'none',
            scrollTrigger: { trigger: work, start: 'top top', end: () => `+=${distance()}`, pin: true, scrub: 1, invalidateOnRefresh: true },
          })
        })
        desktop.add('(max-width: 899px)', () => createHeroZoom(.85, 5))
        ScrollTrigger.sort()
        ScrollTrigger.refresh()
      }
      gsap.fromTo('.timeline-progress', { height: '0%' }, {
        height: '100%', ease: 'none',
        scrollTrigger: {
          trigger: '.timeline', start: 'top 65%', end: 'bottom 65%',
          scrub: .4, invalidateOnRefresh: true,
        },
      })
      // Let the entrance finish before scroll tweens record their initial values.
      // Otherwise a breakpoint change can restore the hidden entrance state.
      gsap.fromTo('.matrix-position', { autoAlpha: 0, y: 120, scale: .88 }, {
        autoAlpha: 1, y: 0, scale: 1, duration: 1.45, delay: .1, ease: 'power3.out',
        onComplete: createScrollMotion,
      })
      gsap.utils.toArray<HTMLElement>('.reveal').forEach((element) => {
        gsap.fromTo(element, { autoAlpha: 0, y: 26 }, {
          autoAlpha: 1, y: 0, duration: .85, ease: 'power3.out',
          scrollTrigger: { trigger: element, start: 'top 90%', once: true },
        })
      })
      return () => desktop.revert()
    }, root)
    return () => ctx.revert()
  }, [loaded, reducedMotion])

  return (
    <div ref={root} className="site-shell">
      {!loaded && !reducedMotion && (
        <div ref={loader} className="preloader" aria-live="polite">
          <strong className="preloader-name">Jishnu Guha</strong>
          <div className="loader-marquee" aria-hidden="true">SOFTWARE ENGINEER&nbsp; • &nbsp;BUILDING WHAT MATTERS&nbsp; • &nbsp;SOFTWARE ENGINEER&nbsp; • &nbsp;</div>
          <div className="loader-counter"><span>LOADING</span><span>{progress}%</span></div>
          <span className="loader-welcome">WELCOME</span>
        </div>
      )}

      <header className="site-header">
        <a className="brand" href="#top" onClick={scrollToTop} aria-label="Jishnu Guha, back to top">JG</a>
        <a className="header-email" href="mailto:jishnuguha121@gmail.com">jishnuguha121@gmail.com</a>
        <nav aria-label="Main navigation"><a href="#about">ABOUT</a><a href="#work">WORK</a><a href="#contact">CONTACT</a></nav>
      </header>

      <aside className="social-rail" aria-label="Social links">
        <a href="https://github.com/notJishnu" target="_blank" rel="noreferrer" aria-label="GitHub"><SiGithub /></a>
        <a href="https://www.linkedin.com/in/jishnuguha04/" target="_blank" rel="noreferrer" aria-label="LinkedIn"><FaLinkedinIn /></a>
        <a href="https://leetcode.com/u/Jishnu_Guha/" target="_blank" rel="noreferrer" aria-label="LeetCode"><SiLeetcode /></a>
      </aside>
      <span className="side-cue" aria-hidden="true"><i /> SCROLL TO EXPLORE</span>

      <main>
        <section id="top" className="hero">
          <div className="hero-glow hero-glow-left" aria-hidden="true" />
          <div className="hero-glow hero-glow-right" aria-hidden="true" />
          <div className="hero-copy hero-name hero-enter">
            <p>Hello! I&apos;m</p><h1>JISHNU<br />GUHA</h1>
          </div>
          <div className="matrix-position"><MatrixRain reducedMotion={reducedMotion} /></div>
          <div className="hero-copy hero-role hero-enter">
            <p>A</p><h2><span>SOFTWARE</span><br /><strong>ENGINEER</strong></h2>
          </div>
          <a className="hero-down" href="#about" aria-label="Scroll to about">↓</a>
        </section>

        <section id="about" className="about-section section-frame">
          <div className="section-inner">
            <div className="about-intro reveal">
              <p className="eyebrow">ABOUT ME</p>
              <p>Software engineer building practical, people-focused products across web and machine learning. I turn complex ideas into clear, useful experiences.</p>
            </div>
            <div className="about-showcase">
              <h2 className="about-display reveal">WHAT <span>I DO</span></h2>
              <div className="about-stage" aria-hidden="true">
                <div className="about-graphic">
                  <span className="about-graphic-top">TWO SIDES OF THE SAME IDEA <b>↗</b></span>
                  <div className="about-graphic-word">BUILD<span>01</span></div>
                  <div className="about-graphic-rule"><i /></div>
                  <div className="about-graphic-word">LEARN<span>02</span></div>
                  <span className="about-graphic-bottom">WEB / DATA / PEOPLE</span>
                </div>
              </div>
              <div className="focus-grid">
                <article className="focus-card reveal">
                  <span className="focus-index">01 / BUILD</span>
                  <h3>WEB<br />DEVELOPMENT</h3>
                  <p>Thoughtful interfaces and full-stack products that make complex tasks feel simple.</p>
                  <FiArrowUpRight aria-hidden="true" />
                </article>
                <article className="focus-card reveal">
                  <span className="focus-index">02 / EXPLORE</span>
                  <h3>MACHINE<br />LEARNING</h3>
                  <p>Data-driven tools that turn models and insights into useful everyday experiences.</p>
                  <FiArrowUpRight aria-hidden="true" />
                </article>
              </div>
            </div>
          </div>
        </section>

        <section id="education" className="education-section section-frame">
          <div className="section-inner">
            <h2 className="timeline-heading reveal">My education &<br /><span>experience</span></h2>
            <div className="timeline">
              <div className="timeline-track" aria-hidden="true"><div className="timeline-progress"><span className="timeline-tip" /></div></div>
              {education.map((item) => (
                <article className="timeline-row reveal" key={item.title}>
                  <div><h3>{item.title}</h3><p>{item.place}</p></div>
                  <strong>{item.years}</strong>
                  <div className="timeline-detail"><p>{item.detail}</p><span>{item.grade}</span></div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="work" className="work-section section-frame">
          <div className="section-inner"><h2 className="work-heading reveal">My <span>Work</span></h2></div>
          <div className="project-track">
            {projects.map((project) => (
              <article className={`project-card reveal${project.image ? '' : ' no-visual'}`} key={project.title}>
                {project.image && <div className="project-visual"><Image src={project.image} alt={`${project.title} website preview`} fill sizes="(max-width: 700px) 90vw, 38vw" /></div>}
                <div className="project-meta"><strong>{project.number}</strong><div><h3>{project.title}</h3><p>{project.category}</p></div></div>
                <div className="project-details"><h4>Tools and features</h4><p>{project.tools}</p><p className="project-description">{project.description}</p></div>
                <div className="project-actions"><a href={project.demo} target="_blank" rel="noreferrer">Live site <FiArrowUpRight /></a>{project.source && <a href={project.source} target="_blank" rel="noreferrer">Source <FiArrowUpRight /></a>}</div>
              </article>
            ))}
            <div className="project-more"><h3>Want to see<br />more?</h3><p>Explore the rest of my work on GitHub.</p><a href="https://github.com/notJishnu" target="_blank" rel="noreferrer">See all work <FiArrowUpRight /></a></div>
          </div>
        </section>

        <section id="stack" className="stack-section section-frame">
          <div className="stack-glow" aria-hidden="true" />
          <div className="section-inner">
            <h2 className="reveal">TECH STACK</h2>
            <p className="stack-description reveal">Tools used across the projects featured here.</p>
            <div className="skills-grid">
              {skills.map(({ name, Icon }) => <div className="skill-tile reveal" key={name}><Icon aria-hidden="true" /><span>{name}</span></div>)}
            </div>
            <div className="stack-actions reveal"><a href="#work">Explore work <FiArrowRight /></a><a href="mailto:jishnuguha121@gmail.com?subject=Portfolio%20inquiry">Hire me <FiArrowRight /></a></div>
          </div>
        </section>

        <footer id="contact" className="contact-section section-frame">
          <div className="section-inner">
            <h2 className="reveal">JISHNU GUHA</h2>
            <div className="contact-grid">
              <div className="reveal"><h3>Email</h3><a href="mailto:jishnuguha121@gmail.com">jishnuguha121@gmail.com</a><h3>Role</h3><p>Software Engineer</p></div>
              <div className="reveal"><h3>Social</h3><a href="https://github.com/notJishnu" target="_blank" rel="noreferrer">GitHub <FiArrowUpRight /></a><a href="https://www.linkedin.com/in/jishnuguha04/" target="_blank" rel="noreferrer">LinkedIn <FiArrowUpRight /></a><a href="https://leetcode.com/u/Jishnu_Guha/" target="_blank" rel="noreferrer">LeetCode <FiArrowUpRight /></a></div>
            </div>
            <div className="footer-bottom"><p>Designed and developed<br />by <span>Jishnu Guha</span></p><a href="#top" onClick={scrollToTop}>Back to top ↑</a><span>© 2026</span></div>
          </div>
        </footer>
      </main>
    </div>
  )
}
