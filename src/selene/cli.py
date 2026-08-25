"""SELENE-MATCH command-line entry point.

    selene run    --src <path> --ref <path> --out <job_dir>
    selene eval   --job <job_dir>
    selene export --job <job_dir> --zip <output.zip>

Owner: P4 integrates this once all stage modules exist; each P owns their
own stage function and this file just wires Stage 0 -> Stage 8 in order.
See docs/architecture.md for the Pair / Match / Product contracts each
stage must respect.
"""
import argparse


def main() -> None:
    parser = argparse.ArgumentParser(prog="selene")
    sub = parser.add_subparsers(dest="command", required=True)

    p_run = sub.add_parser("run", help="Run the full correspondence + registration pipeline")
    p_run.add_argument("--src", required=True)
    p_run.add_argument("--ref", required=True)
    p_run.add_argument("--out", required=True)

    p_eval = sub.add_parser("eval", help="Compute/print evaluation metrics for a job")
    p_eval.add_argument("--job", required=True)

    p_export = sub.add_parser("export", help="Package a job's deliverables into a zip bundle")
    p_export.add_argument("--job", required=True)
    p_export.add_argument("--zip", required=True)

    args = parser.parse_args()
    raise NotImplementedError(f"Wire up '{args.command}' once Stage 0-8 modules are implemented.")


if __name__ == "__main__":
    main()
