import { describe, it, expect } from 'vitest';
import { resolveRelativePath } from '../../../src/utils/pathResolver';

describe('pathResolver', () => {
  describe('resolveRelativePath', () => {
    it('should resolve a sibling file', () => {
      expect(resolveRelativePath('docs/guides/setup.md', './file.md')).toBe('docs/guides/file.md');
      expect(resolveRelativePath('docs/guides/setup.md', 'file.md')).toBe('docs/guides/file.md');
    });

    it('should resolve a parent file', () => {
      expect(resolveRelativePath('docs/guides/setup.md', '../api/client.md')).toBe('docs/api/client.md');
    });

    it('should resolve multiple levels up', () => {
      expect(resolveRelativePath('docs/guides/advanced/setup.md', '../../index.md')).toBe('docs/index.md');
    });

    it('should not go above root', () => {
      expect(resolveRelativePath('docs/setup.md', '../../index.md')).toBe('index.md');
    });

    it('should handle absolute paths', () => {
      expect(resolveRelativePath('docs/setup.md', '/root/file.md')).toBe('/root/file.md');
    });

    it('should handle external URLs', () => {
      expect(resolveRelativePath('docs/setup.md', 'https://example.com/file.md')).toBe('https://example.com/file.md');
      expect(resolveRelativePath('docs/setup.md', 'http://example.com/file.md')).toBe('http://example.com/file.md');
    });
  });
});
