import { Worker } from 'worker_threads';
const { logger } = require('./log.ts');
import path from 'path';

interface Task {
  type?: string
  id: number
  data: any
  resolve: (result: any) => void
  reject: (error: Error) => void
}

class ThreadPool {
  private workers: Worker[] = [];
  private taskQueue: Task[] = [];
  private workerCount: number;
  private workerScriptPath: string;
  private isShuttingDown: boolean = false;
  /** 线程状态 */
  private workerStatusMap: Map<number, Task | null> = new Map();

  constructor(workerCount: number, workerScriptPath: string) {
    this.workerCount = workerCount;
    this.workerScriptPath = workerScriptPath;
    this.initializeWorkers();
  }

  /**
   * 处理runTask方法中Promise的后续逻辑
   * @param thId 线程ID & Map值
   * @param data 任务返回数据
   */
  private resolveAndSetMap = (thId: number, data: any) => {
    const task = this.workerStatusMap.get(thId);
    if (task) {
      if (data.error) {
        task.reject(new Error(data));
      } else {
        task.resolve(data);
      }
      this.workerStatusMap.set(thId, null)
    }
  }

  /**
   * 线程全空闲
   */
  private checkThreadAllFree = (): boolean => {
    let allFree: boolean = true;
    for (const value of this.workerStatusMap) {
      if (value) {
        allFree = false;
        break;
      }
    }
    return allFree;
  }

  /**
   * 初始化工作线程池
   */
  private initializeWorkers() {
    for (let i = 0; i < this.workerCount; i++) {
      const worker = new Worker(this.workerScriptPath);
      worker.on('message', (message: any) => {
        // console.log('收到消息----message-:', message);
        // 可能的任务启动节点2：新任务、任务完成信息
        if (message.type === 'task_completed') {
          this.resolveAndSetMap(worker.threadId, message)
        }
        if (['new_task', 'task_completed'].includes(message.type))
          this.runNextTask();
      });
      worker.on('exit', (code: number) => {
        logger.info(`Worker stopped with exit code ${code}`);
        // console.log(`Worker stopped with exit code ${code}`);
        this.resolveAndSetMap(worker.threadId, {
          type: 'exit',
          msg: `Worker stopped with exit code ${code}`
        })
        // 可能的任务启动节点3：任务退出
        this.runNextTask();
      });
      worker.on('error', (error: Error) => {
        logger.error(`Worker stopped with Error`, error);
        // console.error(`Worker error: ${error.message}`);
        this.resolveAndSetMap(worker.threadId, error)
        // 可能的任务启动节点4：任务报错
        this.runNextTask();
      });
      this.workers.push(worker);
      // 设置线程初始值
      this.workerStatusMap.set(worker.threadId, null);
    }
  }

  /**
   * 尝试执行：根据任务队列和线程工作状态，尝试运行下一个任务
   */
  private runNextTask() {
    if (this.isShuttingDown) return;
    if ((this.taskQueue.length === 0 && this.checkThreadAllFree())) {
      this.isShuttingDown = true;
      return
    }
    // console.log('runNextTask__map_:', this.workerStatusMap)
    let freeKey: any = null;
    for (const [key, value] of this.workerStatusMap) {
      if (!value) {
        freeKey = key;
        break;
      }
    }
    const worker = this.workers.find(w => w.threadId === freeKey);
    // console.log('runNextTask__freeKey_:', freeKey)
    if (worker) {
      const task = this.taskQueue.shift();
      // console.log('runNextTask__task_:', task)
      if (task) {
        // console.log('runNextTask__传递_:', freeKey)
        worker.postMessage({
          type: 'new_task',
          id: task.id,
          data: task.data,
        });
        this.workerStatusMap.set(worker.threadId, task);
      } else {
        let hasRunning: any = null;
        for (const [key, value] of this.workerStatusMap) {
          if (value) {
            hasRunning = key;
            // console.log(`无任务-线程${key}-仍在运行`)
            break;
          }
        }
        if (hasRunning === null) {
          logger.info(`所有线程空闲-任务结束`);
          // console.log('无任务-所有线程空闲-：')
          this.isShuttingDown = true;
        }
      }
    }
  }

  /**
   * 新增任务： 触发尝试执行
   * @param data 任务数据
   * @description resolve, reject 被保留并跟随task传递，在resolveAndSetMap方法中被执行
   * @returns 返回Promise对象
   */
  public runTask(data: any): Promise<any> {
    return new Promise((resolve, reject) => {
      const task: Task = {
        id: Date.now() + Math.random(),
        data,
        resolve,
        reject
      };
      this.taskQueue.push(task);
      logger.trace(`当前任务-taskQueue`,this.taskQueue);
      // console.log('taskQueue', this.taskQueue)
      // 可能的任务启动节点1：有新任务加入、有空闲线程、非关闭状态
      this.runNextTask();
    });
  }

  public async shutdown(): Promise<void> {
    this.isShuttingDown = true;
    await Promise.all(this.workers.map(worker => {
      return new Promise(resolve => {
        worker.on('exit', resolve);
        worker.postMessage({ type: 'shutdown' });
      });
    }));
  }
}

export default ThreadPool;