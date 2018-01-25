import {CellRange} from './../3rdparty/walkontable/src';

/**
 * The SelectionRange class is a simple CellRanges collection designed for easy manipulation of the multiple
 * consecutive and non-consecutive selections.
 */
class SelectionRange {
  constructor() {
    /**
     * List of all CellRanges added to the class instance.
     *
     * @type {CellRange[]}
     */
    this.ranges = [];
  }

  /**
   * Check if selected range is empty.
   *
   * @return {Boolean}
   */
  isEmpty() {
    return this.size() === 0;
  }

  /**
   * Set coordinates to the class instance. It clears all previously added coordinates and push `coords`
   * to the collection.
   *
   * @param {CellCoords} coords The CellCoords instance with defined coordinates.
   * @returns {SelectionRange}
   */
  set(coords) {
    this.clear();
    this.ranges.push(new CellRange(coords));

    return this;
  }

  /**
   * Add coordinates to the class instance. The new coordinates are added to the end of the range collection.
   *
   * @param {CellCoords} coords The CellCoords instance with defined coordinates.
   * @returns {SelectionRange}
   */
  add(coords) {
    this.ranges.push(new CellRange(coords));

    return this;
  }

  /**
   * Get last added coordinates from ranges, it returns a CellRange instance.
   *
   * @return {CellCoords|undefined}
   */
  current() {
    return this.peekByIndex(0);
  }

  /**
   * Get previously added coordinates from ranges, it returns a CellRange instance.
   *
   * @return {CellCoords|undefined}
   */
  previous() {
    return this.peekByIndex(-1);
  }

  /**
   * Clear collection.
   *
   * @return {SelectionRange}
   */
  clear() {
    this.ranges.length = 0;

    return this;
  }

  /**
   * Get count of added all coordinates added to the selection.
   *
   * @return {Number}
   */
  size() {
    return this.ranges.length;
  }

  /**
   * Peek the coordinates based on the index where that coordinate resides in the collection.
   *
   * @param {Number} [index=0] An index where the coordinate will be retrieved from.
   * @return {CellRange|undefined}
   */
  peekByIndex(index = 0) {
    const rangeIndex = this.size() + index - 1;
    let cellRange;

    if (rangeIndex >= 0) {
      cellRange = this.ranges[rangeIndex];
    }

    return cellRange;
  }

  [Symbol.iterator]() {
    return this.ranges[Symbol.iterator]();
  }
}

export default SelectionRange;
