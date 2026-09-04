import { useState } from 'react';
import { ArrowUpRight, Github, Linkedin, Mail, Menu, Moon, Send, Sun, Twitter, X } from 'lucide-react';

const projects = [
  { title: 'Field Notes', description: 'A calm digital journal that makes room for ideas, observations, and the occasional detour.', image: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=1200&q=85', tags: ['React', 'Design system'] },
  { title: 'Common Ground', description: 'A neighborhood guide that helps people find independent places worth returning to.', image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&q=85', tags: ['Research', 'Web design'] },
  { title: 'Stillwater', description: 'A ritual-building app designed to turn small intentions into durable daily practice.', image: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1200&q=85', tags: ['Product', 'Mobile'] },
];

const socialLinks = [{ label: 'GitHub', icon: Github, href: 'https://github.com' }, { label: 'LinkedIn', icon: Linkedin, href: 'https://linkedin.com' }, { label: 'Twitter', icon: Twitter, href: 'https://twitter.com' }];

export default function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const isValid = form.name.trim() && /^\S+@\S+\.\S+$/.test(form.email) && form.message.trim();
  const handleSubmit = (event) => { event.preventDefault(); if (isValid) setSubmitted(true); };
  const updateField = (event) => { setSubmitted(false); setForm({ ...form, [event.target.name]: event.target.value }); };

  return <div className={darkMode ? 'portfolio dark' : 'portfolio'}>
    <header className="site-header">
      <a className="brand" href="#top" aria-label="Anthony Tancredi home">AT<span>.</span></a>
      <nav className={menuOpen ? 'nav-links nav-open' : 'nav-links'} aria-label="Main navigation">
        {['Work', 'About', 'Contact'].map((item) => <a key={item} href={`#${item.toLowerCase()}`} onClick={() => setMenuOpen(false)}>{item}</a>)}
      </nav>
      <div className="header-actions">
        <button className="icon-button" type="button" onClick={() => setDarkMode(!darkMode)} aria-label={darkMode ? 'Use light theme' : 'Use dark theme'} title={darkMode ? 'Use light theme' : 'Use dark theme'}>{darkMode ? <Sun size={18} /> : <Moon size={18} />}</button>
        <button className="icon-button menu-button" type="button" onClick={() => setMenuOpen(!menuOpen)} aria-label={menuOpen ? 'Close navigation' : 'Open navigation'}>{menuOpen ? <X size={21} /> : <Menu size={21} />}</button>
      </div>
    </header>
    <main id="top">
      <section className="hero" aria-labelledby="hero-heading">
        <div className="hero-copy"><p className="eyebrow">Independent designer and developer</p><h1 id="hero-heading">Anthony Tancredi<br /><em>makes useful things</em><br />feel inevitable.</h1><p className="hero-intro">I design and build thoughtful digital experiences for people and organizations doing work that matters.</p><a className="primary-link" href="mailto:hello@anthonytancredi.design">Contact me <ArrowUpRight size={18} /></a></div>
        <div className="hero-art" aria-hidden="true"><div className="sun-disc" /><p>01 / 04</p></div>
      </section>
      <section className="projects section-wrap" id="work" aria-labelledby="work-heading">
        <div className="section-heading"><p className="eyebrow">Selected work</p><h2 id="work-heading">Ideas, made tangible.</h2><p>Selected projects across digital products, visual identities, and editorial spaces.</p></div>
        <div className="project-grid">{projects.map((project, index) => <article className="project-card" key={project.title}><a href="#contact" className="project-image" aria-label={`Discuss ${project.title}`}><img src={project.image} alt="" /><span className="project-index">0{index + 1}</span><span className="project-arrow"><ArrowUpRight size={21} /></span></a><div className="project-details"><h3>{project.title}</h3><p>{project.description}</p><div className="tag-row">{project.tags.map((tag) => <span key={tag}>{tag}</span>)}</div></div></article>)}</div>
      </section>
      <section className="about" id="about" aria-labelledby="about-heading">
        <div className="about-image"><img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=900&q=85" alt="Anthony Tancredi smiling outdoors" /></div>
        <div className="about-copy"><p className="eyebrow">A little about me</p><h2 id="about-heading">Good work begins with close attention.</h2><div className="centered-copy"><p>For the last eight years, I have worked where strategy, design, and code meet. I enjoy untangling ambitious problems and giving them a clear, memorable shape.</p><p>Based in New York, working with curious teams everywhere.</p></div><ul className="skills" aria-label="Skills"><li>Product strategy</li><li>UX &amp; UI design</li><li>Creative direction</li><li>Front-end development</li></ul></div>
      </section>
      <section className="contact section-wrap" id="contact" aria-labelledby="contact-heading">
        <div className="contact-intro"><p className="eyebrow">Start a conversation</p><h2 id="contact-heading">Have a good idea?</h2><p>Tell me a little about it. I am currently taking on select projects for 2026.</p><a href="mailto:hello@anthonytancredi.design" className="email-link"><Mail size={17} /> hello@anthonytancredi.design</a></div>
        <form className="contact-form" onSubmit={handleSubmit} noValidate><label>Name<input name="name" value={form.name} onChange={updateField} autoComplete="name" required /></label><label>Email<input name="email" type="email" value={form.email} onChange={updateField} autoComplete="email" required /></label><label>Message<textarea name="message" value={form.message} onChange={updateField} rows="4" required /></label><button className="submit-button" type="submit" disabled={!isValid}><span>{submitted ? 'Message sent' : 'Send message'}</span><Send size={17} /></button>{submitted && <p className="form-status" role="status">Thanks. I will be in touch shortly.</p>}</form>
      </section>
    </main>
    <footer className="site-footer"><a className="brand" href="#top" aria-label="Back to top">AT<span>.</span></a><p>© {new Date().getFullYear()} Anthony Tancredi</p><div className="social-links">{socialLinks.map(({ label, icon: Icon, href }) => <a key={label} href={href} aria-label={`Anthony Tancredi on ${label}`} title={label} target="_blank" rel="noreferrer"><Icon size={18} /></a>)}</div></footer>
  </div>;
}
