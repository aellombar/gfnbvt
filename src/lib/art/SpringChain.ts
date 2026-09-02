/**
 * Tiny damped spring. Hair and cloth layers chase the body's motion through
 * one of these, which is what turns a static drawing into something that
 * feels alive without a single extra frame of art.
 */
export class Spring {
  private value = 0;
  private velocity = 0;

  constructor(
    private readonly stiffness = 0.09,
    private readonly damping = 0.78,
  ) {}

  /** Advance toward `target`. `dt` is in seconds, clamped by the caller. */
  step(target: number, dt: number): number {
    const steps = Math.min(4, Math.max(1, Math.round(dt / (1 / 60))));
    for (let i = 0; i < steps; i += 1) {
      this.velocity += (target - this.value) * this.stiffness;
      this.velocity *= this.damping;
      this.value += this.velocity;
    }
    return this.value;
  }

  get current(): number {
    return this.value;
  }

  reset(value = 0): void {
    this.value = value;
    this.velocity = 0;
  }
}
