import styles from "./landing.module.css";

const steps = [
  {
    "title": "Make a little space",
    "text": "Create your account. Give your plans a home of their own."
  },
  {
    "title": "Get it all down",
    "text": "Big goals, small errands, that idea you don’t want to forget."
  },
  {
    "title": "Take the next step",
    "text": "Pick a task, find your focus, and enjoy checking it off."
  }
];

export function HowItWorks() {
  return (
    <section className={styles.howSection} id="how-it-works" aria-labelledby="how-title">
      <div>
        <p className={styles.sectionEyebrow}>FROM OVERWHELMED TO ON YOUR WAY</p>
        <h2 id="how-title">Your day, with a<br />little more direction.</h2>
        <p>No complicated systems.<br />Just a simple rhythm you can come back to.</p>
      </div>
      <ol className={styles.steps}>
        {steps.map((step, index) => (
          <li key={step.title}>
        <span>0{index + 1}</span>
        <div>
          <h3>{step.title}</h3>
          <p>{step.text}</p>
        </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
