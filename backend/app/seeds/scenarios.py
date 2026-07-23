from __future__ import annotations

from dataclasses import dataclass
from uuid import UUID, uuid5

from sqlalchemy import select
from sqlalchemy.orm import Session, selectinload

from app.database import engine
from app.models import Scenario, ScenarioOption

# Fixed UUID namespace used to produce stable IDs in every environment.
SEED_NAMESPACE = UUID("a597be37-d810-4c55-8685-66ec6b817631")


@dataclass(frozen=True)
class OptionSeed:
    """Deterministic definition of one scenario option."""

    code: str
    label: str
    display_order: int


@dataclass(frozen=True)
class ScenarioSeed:
    """Deterministic definition of one baseline scenario."""

    slug: str
    version: int
    title: str
    category: str
    prompt: str
    options: tuple[OptionSeed, ...]


@dataclass(frozen=True)
class SeedSummary:
    """Summary returned after synchronizing baseline scenarios."""

    scenario_count: int
    option_count: int
    created_scenarios: int
    created_options: int


BASELINE_SCENARIOS: tuple[ScenarioSeed, ...] = (
    # Section 1: Conjunction Judgement
    ScenarioSeed(
        slug="conjunction-fallacy",
        version=1,
        title="Decision Scenario 1",
        category="conjunction-judgement",
        prompt=(
            "A person is described as highly analytical and detail-oriented. "
            "Which statement is more probable?"
        ),
        options=(
            OptionSeed(
                code="A",
                label="The person works in finance.",
                display_order=0,
            ),
            OptionSeed(
                code="B",
                label="The person works in finance and regularly invests in the stock market.",
                display_order=1,
            ),
        ),
    ),
    ScenarioSeed(
        slug="conjunction-judgement-2",
        version=1,
        title="Decision Scenario 2",
        category="conjunction-judgement",
        prompt=(
            "A person is described as creative and enjoys working independently. "
            "Which statement is more probable?"
        ),
        options=(
            OptionSeed(
                code="A",
                label="The person is a designer.",
                display_order=0,
            ),
            OptionSeed(
                code="B",
                label="The person is a designer and runs a freelance business.",
                display_order=1,
            ),
        ),
    ),
    ScenarioSeed(
        slug="conjunction-judgement-3",
        version=1,
        title="Decision Scenario 3",
        category="conjunction-judgement",
        prompt=(
            "A person is described as socially active and interested in community work. "
            "Which statement is more probable?"
        ),
        options=(
            OptionSeed(
                code="A",
                label="The person volunteers occasionally.",
                display_order=0,
            ),
            OptionSeed(
                code="B",
                label="The person volunteers occasionally and participates in local campaigns.",
                display_order=1,
            ),
        ),
    ),
    ScenarioSeed(
        slug="conjunction-judgement-4",
        version=1,
        title="Decision Scenario 4",
        category="conjunction-judgement",
        prompt=(
            "A student consistently performs well academically. "
            "Which statement is more probable?"
        ),
        options=(
            OptionSeed(
                code="A",
                label="The student will pass the exam.",
                display_order=0,
            ),
            OptionSeed(
                code="B",
                label="The student will pass the exam and achieve a top grade.",
                display_order=1,
            ),
        ),
    ),
    ScenarioSeed(
        slug="conjunction-judgement-5",
        version=1,
        title="Decision Scenario 5",
        category="conjunction-judgement",
        prompt=(
            "A person is described as organised and enjoys working with data. "
            "Which statement is more probable?"
        ),
        options=(
            OptionSeed(
                code="A",
                label="The person works as a data analyst.",
                display_order=0,
            ),
            OptionSeed(
                code="B",
                label="The person works as a data analyst and regularly builds predictive models.",
                display_order=1,
            ),
        ),
    ),

    # Section 2: Framing
    ScenarioSeed(
        slug="framing-effect",
        version=1,
        title="Decision Scenario 6",
        category="framing",
        prompt=(
            "Investment Scenario. You are considering two investment options. "
            "Which option do you choose?"
        ),
        options=(
            OptionSeed(
                code="A",
                label="A guaranteed return of £500.",
                display_order=0,
            ),
            OptionSeed(
                code="B",
                label="A 50% chance to gain £1000 and a 50% chance to gain nothing.",
                display_order=1,
            ),
        ),
    ),
    ScenarioSeed(
        slug="framing-effect-2",
        version=1,
        title="Decision Scenario 7",
        category="framing",
        prompt="Loss Framing. Which option do you choose?",
        options=(
            OptionSeed(
                code="A",
                label="A guaranteed loss of £500.",
                display_order=0,
            ),
            OptionSeed(
                code="B",
                label="A 50% chance to lose £1000 and a 50% chance to lose nothing.",
                display_order=1,
            ),
        ),
    ),
    ScenarioSeed(
        slug="framing-effect-3",
        version=1,
        title="Decision Scenario 8",
        category="framing",
        prompt=(
            "Business Decision. A company is deciding between two strategies. "
            "Which option is preferable?"
        ),
        options=(
            OptionSeed(
                code="A",
                label="This strategy will ensure 70% of profits are retained.",
                display_order=0,
            ),
            OptionSeed(
                code="B",
                label="This strategy carries a 30% chance of losing all profits.",
                display_order=1,
            ),
        ),
    ),
    ScenarioSeed(
        slug="framing-effect-4",
        version=1,
        title="Decision Scenario 9",
        category="framing",
        prompt="Insurance Decision. Which option do you choose?",
        options=(
            OptionSeed(
                code="A",
                label="Pay £200 to fully avoid a potential loss.",
                display_order=0,
            ),
            OptionSeed(
                code="B",
                label="20% chance of losing £1000 and 80% chance of losing nothing.",
                display_order=1,
            ),
        ),
    ),
    ScenarioSeed(
        slug="framing-effect-5",
        version=1,
        title="Decision Scenario 10",
        category="framing",
        prompt="Investment Framing. Which option do you prefer?",
        options=(
            OptionSeed(
                code="A",
                label="80% chance of gaining £1000.",
                display_order=0,
            ),
            OptionSeed(
                code="B",
                label="20% chance of gaining nothing.",
                display_order=1,
            ),
        ),
    ),

    # Section 3: Risk Preferences
    ScenarioSeed(
        slug="risk-preference",
        version=1,
        title="Decision Scenario 11",
        category="risk-preference",
        prompt="Financial Choice. Which option do you choose?",
        options=(
            OptionSeed(
                code="A",
                label="Guaranteed £400.",
                display_order=0,
            ),
            OptionSeed(
                code="B",
                label="50% chance of £900 and 50% chance of £0.",
                display_order=1,
            ),
        ),
    ),
    ScenarioSeed(
        slug="risk-preference-2",
        version=1,
        title="Decision Scenario 12",
        category="risk-preference",
        prompt="Loss Scenario. Which option do you choose?",
        options=(
            OptionSeed(
                code="A",
                label="Guaranteed loss of £300.",
                display_order=0,
            ),
            OptionSeed(
                code="B",
                label="50% chance of losing £700 and 50% chance of losing nothing.",
                display_order=1,
            ),
        ),
    ),
    ScenarioSeed(
        slug="risk-preference-3",
        version=1,
        title="Decision Scenario 13",
        category="risk-preference",
        prompt="Career Decision. Which option do you prefer?",
        options=(
            OptionSeed(
                code="A",
                label="Stable job with a fixed salary.",
                display_order=0,
            ),
            OptionSeed(
                code="B",
                label="Startup job with higher potential earnings but high uncertainty.",
                display_order=1,
            ),
        ),
    ),
    ScenarioSeed(
        slug="risk-preference-4",
        version=1,
        title="Decision Scenario 14",
        category="risk-preference",
        prompt="Investment Growth. Which option do you choose?",
        options=(
            OptionSeed(
                code="A",
                label="Guaranteed return of £2000.",
                display_order=0,
            ),
            OptionSeed(
                code="B",
                label="25% chance of £8000 and 75% chance of £0.",
                display_order=1,
            ),
        ),
    ),
    ScenarioSeed(
        slug="risk-preference-5",
        version=1,
        title="Decision Scenario 15",
        category="risk-preference",
        prompt="Project Choice. Which option do you choose?",
        options=(
            OptionSeed(
                code="A",
                label="Choose a project with guaranteed moderate results.",
                display_order=0,
            ),
            OptionSeed(
                code="B",
                label="Choose a project with high potential but risk of failure.",
                display_order=1,
            ),
        ),
    ),

    # Section 4: Probability Judgement
    ScenarioSeed(
        slug="probability-judgement-1",
        version=1,
        title="Decision Scenario 16",
        category="probability-judgement",
        prompt="Which statement is more probable?",
        options=(
            OptionSeed(
                code="A",
                label="Drawing one red card from a standard deck.",
                display_order=0,
            ),
            OptionSeed(
                code="B",
                label="Drawing two red cards consecutively without replacement.",
                display_order=1,
            ),
        ),
    ),
    ScenarioSeed(
        slug="probability-judgement-2",
        version=1,
        title="Decision Scenario 17",
        category="probability-judgement",
        prompt="Which statement is more likely?",
        options=(
            OptionSeed(
                code="A",
                label="A randomly selected individual owns a car.",
                display_order=0,
            ),
            OptionSeed(
                code="B",
                label="A randomly selected individual owns a car and commutes daily.",
                display_order=1,
            ),
        ),
    ),
    ScenarioSeed(
        slug="probability-judgement-3",
        version=1,
        title="Decision Scenario 18",
        category="probability-judgement",
        prompt="Which statement is more probable?",
        options=(
            OptionSeed(
                code="A",
                label="A randomly selected student scores above average.",
                display_order=0,
            ),
            OptionSeed(
                code="B",
                label="A randomly selected student scores above average and receives a distinction.",
                display_order=1,
            ),
        ),
    ),
    ScenarioSeed(
        slug="probability-judgement-4",
        version=1,
        title="Decision Scenario 19",
        category="probability-judgement",
        prompt="Which statement is more likely?",
        options=(
            OptionSeed(
                code="A",
                label="A product passes quality inspection.",
                display_order=0,
            ),
            OptionSeed(
                code="B",
                label="A product passes inspection and is shipped on time.",
                display_order=1,
            ),
        ),
    ),
    ScenarioSeed(
        slug="probability-judgement-5",
        version=1,
        title="Decision Scenario 20",
        category="probability-judgement",
        prompt="Which statement is more probable?",
        options=(
            OptionSeed(
                code="A",
                label="A person is employed.",
                display_order=0,
            ),
            OptionSeed(
                code="B",
                label="A person is employed and works full-time.",
                display_order=1,
            ),
        ),
    ),
)


def _scenario_uuid(seed: ScenarioSeed) -> UUID:
    """Return the stable UUID for a baseline scenario."""

    name = f"scenario:{seed.slug}:version:{seed.version}"

    return uuid5(SEED_NAMESPACE, name)


def _option_uuid(
    scenario_seed: ScenarioSeed,
    option_seed: OptionSeed,
) -> UUID:
    """Return the stable UUID for one baseline scenario option."""

    name = (
        f"scenario:{scenario_seed.slug}:"
        f"version:{scenario_seed.version}:"
        f"option:{option_seed.code}"
    )

    return uuid5(SEED_NAMESPACE, name)


def _get_existing_scenario(
    database_session: Session,
    seed: ScenarioSeed,
) -> Scenario | None:
    """Load an existing scenario and its options by slug and version."""

    statement = (
        select(Scenario)
        .where(
            Scenario.slug == seed.slug,
            Scenario.version == seed.version,
        )
        .options(selectinload(Scenario.options))
    )

    return database_session.scalar(statement)


def _validate_existing_option_codes(
    scenario: Scenario,
    seed: ScenarioSeed,
) -> None:
    """
    Refuse to silently remove unexpected options.

    Removing an option could invalidate existing participant responses.
    A baseline-definition change should therefore be handled explicitly.
    """

    expected_codes = {option.code for option in seed.options}

    existing_codes = {option.code for option in scenario.options}

    unexpected_codes = existing_codes - expected_codes

    if unexpected_codes:
        formatted_codes = ", ".join(sorted(unexpected_codes))

        raise RuntimeError(
            f"Scenario '{seed.slug}' contains unexpected option code(s): "
            f"{formatted_codes}. Resolve them before running the seed again."
        )


def _synchronize_options(
    database_session: Session,
    *,
    scenario: Scenario,
    scenario_seed: ScenarioSeed,
) -> int:
    """Create or update every expected option for one scenario."""

    _validate_existing_option_codes(
        scenario,
        scenario_seed,
    )

    existing_options = {option.code: option for option in scenario.options}

    created_options = 0

    # Move existing options temporarily out of the final display-order range.
    # This prevents unique-constraint collisions if their order has changed.
    temporary_order_start = (
        max(
            (option.display_order for option in scenario.options),
            default=0,
        )
        + 1000
    )

    for index, option in enumerate(scenario.options):
        option.display_order = temporary_order_start + index

    if scenario.options:
        database_session.flush()

    for option_seed in scenario_seed.options:
        option = existing_options.get(option_seed.code)

        if option is None:
            option = ScenarioOption(
                id=_option_uuid(
                    scenario_seed,
                    option_seed,
                ),
                scenario=scenario,
                code=option_seed.code,
                label=option_seed.label,
                display_order=option_seed.display_order,
            )

            database_session.add(option)
            created_options += 1
        else:
            option.label = option_seed.label
            option.display_order = option_seed.display_order

    database_session.flush()

    return created_options


def seed_baseline_scenarios(
    database_session: Session,
) -> SeedSummary:
    """
    Create or synchronize all Phase 1 baseline scenarios.

    This function flushes database changes but does not commit them.
    The caller owns the surrounding transaction.
    """

    created_scenarios = 0
    created_options = 0
    option_count = 0

    for seed in BASELINE_SCENARIOS:
        scenario = _get_existing_scenario(
            database_session,
            seed,
        )

        if scenario is None:
            scenario = Scenario(
                id=_scenario_uuid(seed),
                slug=seed.slug,
                version=seed.version,
                title=seed.title,
                category=seed.category,
                prompt=seed.prompt,
                is_active=True,
            )

            database_session.add(scenario)
            database_session.flush()

            created_scenarios += 1
        else:
            scenario.title = seed.title
            scenario.category = seed.category
            scenario.prompt = seed.prompt
            scenario.is_active = True

        created_options += _synchronize_options(
            database_session,
            scenario=scenario,
            scenario_seed=seed,
        )

        option_count += len(seed.options)

    database_session.flush()

    return SeedSummary(
        scenario_count=len(BASELINE_SCENARIOS),
        option_count=option_count,
        created_scenarios=created_scenarios,
        created_options=created_options,
    )


def main() -> None:
    """Run the baseline scenario seed from the command line."""

    with Session(engine) as database_session:
        with database_session.begin():
            summary = seed_baseline_scenarios(
                database_session,
            )

    print(
        "Baseline scenarios synchronized: "
        f"{summary.scenario_count} scenario(s), "
        f"{summary.option_count} option(s)."
    )

    print(
        "New records created: "
        f"{summary.created_scenarios} scenario(s), "
        f"{summary.created_options} option(s)."
    )


if __name__ == "__main__":
    main()
