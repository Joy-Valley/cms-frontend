export interface ServerStatusResponse {
  code: number
  data: Data
  message: string
  originUrl: string
  [property: string]: any
}

export interface Data {
  cpu: Cpu
  dist: Dist[]
  mem: Mem
  sys: Sys
  [property: string]: any
}

export interface Cpu {
  cpuNum: number
  free: string
  sys: string
  used: string
  [property: string]: any
}

export interface Dist {
  dirName: string
  free: string
  total: string
  typeName: string
  usage: string
  used: string
  [property: string]: any
}

export interface Mem {
  free: string
  total: string
  usage: string
  used: string
  [property: string]: any
}

export interface Sys {
  computerIp: string
  computerName: string
  osArch: string
  osName: string
  [property: string]: any
}
