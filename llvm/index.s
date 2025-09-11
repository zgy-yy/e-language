	.section	__TEXT,__text,regular,pure_instructions
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
	adrp	x8, _main.a@PAGE
	mov	w9, #1                          ; =0x1
	strb	w9, [x8, _main.a@PAGEOFF]
Lloh0:
	adrp	x9, _anonymous.EF10@PAGE
Lloh1:
	add	x9, x9, _anonymous.EF10@PAGEOFF
	str	x9, [sp, #8]
LBB0_1:                                 ; %do_body0
                                        ; =>This Inner Loop Header: Depth=1
	strb	wzr, [x8, _main.a@PAGEOFF]
	cbnz	wzr, LBB0_1
; %bb.2:                                ; %do_end0
	ldrb	w8, [x8, _main.a@PAGEOFF]
Lloh2:
	adrp	x0, l_format@PAGE
Lloh3:
	add	x0, x0, l_format@PAGEOFF
	str	x8, [sp]
	bl	_printf
	ldp	x29, x30, [sp, #16]             ; 16-byte Folded Reload
	mov	w0, #12                         ; =0xc
	add	sp, sp, #32
	ret
	.loh AdrpAdd	Lloh0, Lloh1
	.loh AdrpAdd	Lloh2, Lloh3
	.cfi_endproc
                                        ; -- End function
	.globl	_anonymous.EF10                 ; -- Begin function anonymous.EF10
	.p2align	2
_anonymous.EF10:                        ; @anonymous.EF10
	.cfi_startproc
; %bb.0:                                ; %entry
	sub	sp, sp, #16
	.cfi_def_cfa_offset 16
	adrp	x8, _main.a@PAGE
	str	w0, [sp, #12]
	strb	wzr, [x8, _main.a@PAGEOFF]
	add	sp, sp, #16
	ret
	.cfi_endproc
                                        ; -- End function
	.section	__TEXT,__cstring,cstring_literals
	.p2align	4, 0x0                          ; @format
l_format:
	.asciz	"in llvm fun, value = %d\n"

	.section	__DATA,__data
	.globl	_global.a                       ; @global.a
	.p2align	2, 0x0
_global.a:
	.long	23                              ; 0x17

	.globl	_main.a                         ; @main.a
.zerofill __DATA,__common,_main.a,1,0
.subsections_via_symbols
