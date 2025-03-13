section .data
    hello db 'Hello, World!', 0xA  ; 定义字符串和换行符
    hello_len equ $ - hello         ; 计算字符串长度

section .text
    global _start                   ; 声明入口点

_start:
    ; 系统调用 sys_write (系统调用号 1)
    mov rax, 1                      ; 系统调用号 (sys_write)
    mov rdi, 1                      ; 文件描述符 (stdout)
    mov rsi, hello                  ; 字符串地址
    mov rdx, hello_len              ; 字符串长度
    syscall                         ; 调用内核

    ; 系统调用 sys_exit (系统调用号 60)
    mov rax, 60                     ; 系统调用号 (sys_exit)
    xor rdi, rdi                    ; 返回值 0
    syscall                         ; 调用内核

