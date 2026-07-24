from __future__ import annotations

from sqlalchemy import text

from app.database import engine

EXPECTED_SCENARIO_COUNT = 20
EXPECTED_OPTION_COUNT = EXPECTED_SCENARIO_COUNT * 2
EXPECTED_COMPLETED_RESPONSE_COUNT = EXPECTED_SCENARIO_COUNT


def _scalar_count(query: str) -> int:
    """Return one integer count from PostgreSQL."""

    with engine.connect() as connection:
        value = connection.execute(text(query)).scalar_one()

    return int(value)


def main() -> None:
    """
    Verify the persisted data created by the full-stack browser workflow.

    The full-stack CI runs real browser tests against the real frontend,
    backend API, and PostgreSQL database. Those tests now use the complete
    20-scenario study, so this verifier must also expect 20 active scenarios
    and 40 scenario options.
    """

    scenario_count = _scalar_count(
        "SELECT COUNT(*) FROM scenarios WHERE is_active = true"
    )

    if scenario_count != EXPECTED_SCENARIO_COUNT:
        raise RuntimeError(
            "Expected exactly "
            f"{EXPECTED_SCENARIO_COUNT} seeded scenarios, "
            f"found {scenario_count}."
        )

    option_count = _scalar_count(
        """
        SELECT COUNT(*)
        FROM scenario_options AS scenario_option
        JOIN scenarios AS scenario
          ON scenario.id = scenario_option.scenario_id
        WHERE scenario.is_active = true
        """
    )

    if option_count != EXPECTED_OPTION_COUNT:
        raise RuntimeError(
            "Expected exactly "
            f"{EXPECTED_OPTION_COUNT} active scenario options, "
            f"found {option_count}."
        )

    participant_count = _scalar_count("SELECT COUNT(*) FROM participants")

    if participant_count < 1:
        raise RuntimeError("Expected at least one persisted participant.")

    session_count = _scalar_count("SELECT COUNT(*) FROM study_sessions")

    if session_count < 1:
        raise RuntimeError("Expected at least one persisted study session.")

    completed_session_count = _scalar_count(
        """
        SELECT COUNT(*)
        FROM study_sessions
        WHERE status = 'completed'
        """
    )

    if completed_session_count < 1:
        raise RuntimeError("Expected at least one completed study session.")

    completed_session_with_full_response_count = _scalar_count(
        f"""
        SELECT COUNT(*)
        FROM study_sessions AS study_session
        WHERE study_session.status = 'completed'
          AND (
            SELECT COUNT(*)
            FROM human_responses AS human_response
            WHERE human_response.session_id = study_session.id
          ) = {EXPECTED_COMPLETED_RESPONSE_COUNT}
        """
    )

    if completed_session_with_full_response_count < 1:
        raise RuntimeError(
            "Expected at least one completed session with "
            f"{EXPECTED_COMPLETED_RESPONSE_COUNT} persisted responses."
        )

    total_response_count = _scalar_count("SELECT COUNT(*) FROM human_responses")

    if total_response_count < EXPECTED_COMPLETED_RESPONSE_COUNT:
        raise RuntimeError(
            "Expected at least "
            f"{EXPECTED_COMPLETED_RESPONSE_COUNT} persisted responses, "
            f"found {total_response_count}."
        )

    print(
        "Full-stack persisted data verified: "
        f"{scenario_count} active scenarios, "
        f"{option_count} active options, "
        f"{participant_count} participant(s), "
        f"{session_count} session(s), "
        f"{total_response_count} response(s)."
    )


if __name__ == "__main__":
    main()
