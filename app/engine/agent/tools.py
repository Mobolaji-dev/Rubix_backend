"""
tools.py — Helper bridges for AST parsing, IBM Bob 2.0 reasoning, and heuristic scoring.
"""

from app.engine.parser import RepoParser, RepoContext
from app.engine.bob_client import BobClient
from app.engine.heuristic import HeuristicEngine, ServiceGrouping, ScoredService


def parse_repository_context(repo_path: str, repo_url: str) -> RepoContext:
    """Run AST static parser over repository code."""
    parser = RepoParser(repo_path=repo_path, repo_url=repo_url)
    return parser.parse()


async def invoke_bob_reasoning(ctx: RepoContext, on_step=None):
    """
    Direct slot to invoke IBM Bob 2.0 full-repository reasoning for service boundary proposals.
    """
    client = BobClient(on_step=on_step)
    return await client.analyse(ctx)


def calculate_coupling_heuristics(ctx: RepoContext, groupings):
    """Run 3-signal heuristic scorer over proposed groupings."""
    engine = HeuristicEngine(ctx)
    return engine.score_all(groupings)
