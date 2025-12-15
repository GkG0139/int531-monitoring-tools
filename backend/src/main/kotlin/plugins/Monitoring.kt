package com.int531.plugins

import dev.hayden.KHealth
import io.ktor.server.application.*
import io.ktor.server.metrics.micrometer.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import io.micrometer.prometheus.PrometheusConfig
import io.micrometer.prometheus.PrometheusMeterRegistry

fun Application.configureMonitoring() {
    install(KHealth)
    val appMicrometerRegistry =
        PrometheusMeterRegistry(PrometheusConfig.DEFAULT)

    install(MicrometerMetrics) {
        registry = appMicrometerRegistry
    }
    routing {
        get("/metrics-micrometer") {
            call.respond(appMicrometerRegistry.scrape())
        }
    }
}
