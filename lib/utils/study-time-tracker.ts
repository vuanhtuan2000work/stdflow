export class StudyTimeTracker {
  private startTime: number | null = null
  private accumulatedTime: number = 0
  private isRunning: boolean = false

  start() {
    if (!this.isRunning) {
      this.startTime = Date.now()
      this.isRunning = true
    }
  }

  pause() {
    if (this.isRunning && this.startTime) {
      this.accumulatedTime += Date.now() - this.startTime
      this.isRunning = false
      this.startTime = null
    }
  }

  reset() {
    this.startTime = null
    this.accumulatedTime = 0
    this.isRunning = false
  }

  getElapsedMinutes(): number {
    let total = this.accumulatedTime
    
    if (this.isRunning && this.startTime) {
      total += Date.now() - this.startTime
    }
    
    return Math.floor(total / 1000 / 60)
  }

  getElapsedSeconds(): number {
    let total = this.accumulatedTime
    
    if (this.isRunning && this.startTime) {
      total += Date.now() - this.startTime
    }
    
    return Math.floor(total / 1000)
  }
}

