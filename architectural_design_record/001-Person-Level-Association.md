# ADR001: Associating Alerts at the Person Level

## Status

Approved by @AliceNoakes as Product Owner

## Context

Currently, in the HMPPS data model, alerts are associated with bookings at the booking level as per NOMIS data association strategy. This approach has been identified as limiting the system's ability to provide a reliable and useful alert system. NOMIS attempts to simulate a person-level association by copying alerts from one booking to the next upon creating a new booking. Additionally, the DPS system displays alerts against the current booking, implicitly suggesting these are the person's alerts rather than being specific to the latest booking. This existing approach leads to several issues, especially in scenarios involving licence recall, and bookings being created and then deleted or merged, which can result in the loss or hiding of crucial alert information. Furthermore, by maintaining the association of alerts to bookings, there's a risk of obscuring alerts tied to historical bookings, which prevents a comprehensive view of the risks a person may pose or face.

## Decision

We propose to enhance the reliability and usefulness of our alert system by associating alerts at the person level instead of the booking level. This decision is supported by the identification of significant opportunities for improvement in how alerts are managed and displayed, which include overcoming the limitations of NOMIS's current workarounds and providing a more accurate, person-centric view of alerts.

The proposed change involves:
- Developing a business rule for handling historical bookings to dictate whether we display all historic alerts associated with an individual or only a selection.
- Flattening the history of alerts across an individual's bookings to associate alerts at the person level.
- Introducing additional audit tables to compensate for losing booking-specific alert history, enabling us to track changes over time without cluttering the current operational data model.
- Incorporating the business rule into our migration strategy and maintaining bidirectional synchronisation between our system and NOMIS.

This decision has been discussed with a principal technical architect, who supports this approach. Furthermore, the consensus among our team is that moving to a person-level association for alerts is the right direction for our project.

## Consequences

The decision to associate alerts at the person level introduces several consequences, including:

- **Complexity in Managing Historical Data:** Establishing a business rule for handling historical bookings introduces complexity in balancing alert visibility.
- **Data Flattening:** Simplifies the data model but makes trend analysis more challenging and requires the introduction of audit and history mechanisms.
- **Increased Effort for Migration and Synchronisation:** Requires more work than maintaining the current structure but is considered necessary for the long-term efficacy and reliability of our system.
- **Potential for Initial Overload:** Initially surfacing more alerts than staff are accustomed to, which may require adjustments in operational procedures.

Despite these challenges, the benefits of a more accurate, person-centric view of alerts are expected to significantly outweigh the downsides. This change aligns with best practices for data management and will improve our service delivery. Mark Nettleton, our Business Analyst, is reviewing data analysis around a potential business rule to inform the flattening of booking alerts into a single value.

The decision is currently Awaiting Decision, and further discussions and approvals are required to proceed.
