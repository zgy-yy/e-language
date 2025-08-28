	.section	__TEXT,__text,regular,pure_instructions
	.globl	_foo                            ; -- Begin function foo
	.p2align	2
_foo:                                   ; @foo
	.cfi_startproc
; %bb.0:                                ; %entry
	mov	w0, #23                         ; =0x17
	ret
	.cfi_endproc
                                        ; -- End function
	.globl	_bar                            ; -- Begin function bar
	.p2align	2
_bar:                                   ; @bar
	.cfi_startproc
; %bb.0:                                ; %entry
	sub	sp, sp, #32
	stp	x29, x30, [sp, #16]             ; 16-byte Folded Spill
	.cfi_def_cfa_offset 32
	.cfi_offset w30, -8
	.cfi_offset w29, -16
	bl	_foo
	ldp	x29, x30, [sp, #16]             ; 16-byte Folded Reload
	str	w0, [sp, #8]
	add	sp, sp, #32
	ret
	.cfi_endproc
                                        ; -- End function
	.globl	_main                           ; -- Begin function main
	.p2align	2
_main:                                  ; @main
	.cfi_startproc
; %bb.0:                                ; %entry
	sub	sp, sp, #32
	stp	x29, x30, [sp, #16]             ; 16-byte Folded Spill
	.cfi_def_cfa_offset 32
	.cfi_offset w30, -8
	.cfi_offset w29, -16
	bl	_bar
	mov	w8, w0
	str	w0, [sp, #8]
Lloh0:
	adrp	x0, l_format@PAGE
Lloh1:
	add	x0, x0, l_format@PAGEOFF
	str	x8, [sp]
	bl	_printf
	ldp	x29, x30, [sp, #16]             ; 16-byte Folded Reload
	mov	w0, #23                         ; =0x17
	add	sp, sp, #32
	ret
	.loh AdrpAdd	Lloh0, Lloh1
	.cfi_endproc
                                        ; -- End function
	.section	__TEXT,__cstring,cstring_literals
	.p2align	4, 0x0                          ; @format
l_format:
	.asciz	"in llvm fun, value = %d\n"

.subsections_via_symbols
