import { describe, it, expect } from 'vitest';
import app from '../../src/app.js';

describe('Backend App', () => {
  it('debe inicializarse correctamente', () => {
    expect(app).toBeDefined();
  });
});
