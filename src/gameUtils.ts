import { MyGameEntity } from "./MyGameEntity";
import { GameObjectType } from "./GameObjectType";
import { Player } from "./Player";
import { Box } from "./Box";
import { emit } from "kontra";
import { Pickup } from "./Pickup";
import { GameEvent } from "./GameEvent";
import { Ball } from "./Ball";
import { Vector } from "./Vector";

// Circle to rectangle collision detection helper
function isCircleRectangleColliding(
  circleCenter: { x: number; y: number },
  circleRadius: number,
  rectPos: { x: number; y: number }, // Top-left corner of rectangle
  rectWidth: number,
  rectHeight: number
): boolean {
  // Find the closest point on the rectangle to the circle center
  const closestX = Math.max(
    rectPos.x,
    Math.min(circleCenter.x, rectPos.x + rectWidth)
  );
  const closestY = Math.max(
    rectPos.y,
    Math.min(circleCenter.y, rectPos.y + rectHeight)
  );

  // Calculate the distance from the circle center to this closest point
  const distanceX = circleCenter.x - closestX;
  const distanceY = circleCenter.y - closestY;
  const distanceSquared = distanceX * distanceX + distanceY * distanceY;

  // Check if the distance is less than the circle's radius
  return distanceSquared < circleRadius * circleRadius;
}

// Calculate overlap and collision response for circle-to-rectangle
function resolveCircleRectangleCollision(
  player: Player | Ball,
  platform: Box
): void {
  const circleRadius = player.radius; // Use the player's radius property
  const circleCenter = {
    x: player.pos.x - player.radius,
    y: player.pos.y + player.radius,
  };

  // Rectangle bounds (top-left corner positioning)
  const rectLeft = platform.pos.x;
  const rectRight = platform.pos.x + platform.width;
  const rectTop = platform.pos.y;
  const rectBottom = platform.pos.y + platform.height;

  // Check if circle center is inside the rectangle
  const isInsideX = circleCenter.x >= rectLeft && circleCenter.x <= rectRight;
  const isInsideY = circleCenter.y >= rectTop && circleCenter.y <= rectBottom;

  if (isInsideX && isInsideY) {
    // Circle center is inside rectangle - push out in the direction of least penetration
    const penetrationLeft = circleCenter.x - rectLeft;
    const penetrationRight = rectRight - circleCenter.x;
    const penetrationTop = circleCenter.y - rectTop;
    const penetrationBottom = rectBottom - circleCenter.y;

    const minPenetration = Math.min(
      penetrationLeft,
      penetrationRight,
      penetrationTop,
      penetrationBottom
    );

    // Original non-bounce logic
    if (minPenetration == penetrationTop) {
      player.pos.y = rectTop - circleRadius;
      if (player.velocity.y > 0) player.velocity.y = 0;
    } else if (minPenetration == penetrationBottom) {
      player.pos.y = rectBottom + circleRadius;
      if (player.velocity.y < 0) player.velocity.y = 0;
    } else if (minPenetration == penetrationLeft) {
      player.pos.x = rectLeft - circleRadius;
      if (player.velocity.x > 0) player.velocity.x = 0;
    } else {
      player.pos.x = rectRight + circleRadius;
      if (player.velocity.x < 0) player.velocity.x = 0;
    }
  }

  // Circle center is outside rectangle - handle edge/corner collisions
  const closestX = Math.max(rectLeft, Math.min(circleCenter.x, rectRight));
  const closestY = Math.max(rectTop, Math.min(circleCenter.y, rectBottom));

  const pushX = circleCenter.x - closestX;
  const pushY = circleCenter.y - closestY;
  const distance = Math.sqrt(pushX * pushX + pushY * pushY);

  if (distance > 0 && distance < circleRadius) {
    const overlap = circleRadius - distance;
    const normalX = pushX / distance;
    const normalY = pushY / distance;

    // Move player out of collision
    player.pos.x += normalX * overlap;
    player.pos.y += normalY * overlap;

    // Handle velocity in the direction of collision
    const velocityDotNormal =
      player.velocity.x * normalX + player.velocity.y * normalY;
    if (velocityDotNormal < 0) {
      if (platform.canBounce && player instanceof Player) {
        // Reflect velocity for bouncing (only for Player)
        player.velocity.x -= 2 * velocityDotNormal * normalX;
        player.velocity.y -= 2 * velocityDotNormal * normalY;
        platform.triggerBounce(); // Trigger visual bounce effect
      } else {
        // Stop velocity for normal collision
        player.velocity.x -= velocityDotNormal * normalX;
        player.velocity.y -= velocityDotNormal * normalY;
      }
    }
  }
}

export function handleOtherCollisions(objects: MyGameEntity[]): void {
  // Check collisions between objects (circles) and platforms (rectangles)
  for (const o of objects) {
    if (o.type == GameObjectType.Ball) {
      objects.forEach((object) => {
        const ball = o as Ball;
        if (ball == object) return;
        if (
          isCircleRectangleColliding(
            ball.pos.add(Vector(-ball.radius, ball.radius)), // Circle center
            ball.radius, // Use ball's radius property
            object.pos || Vector(0, 0), // Rectangle top-left corner
            object.width!,
            object.height!
          )
        ) {
          if (object.type == GameObjectType.Platform) {
            resolveCircleRectangleCollision(ball, object as Box);
          }
        }
      });
    }
  }
}

export function handlePlayerCollisions(
  player: Player,
  objects: MyGameEntity[]
): void {
  // Check collisions between player (circle) and platforms (rectangles)
  for (const o of objects) {
    if (o == player) continue;
    if (
      isCircleRectangleColliding(
        player.pos.add(Vector(-player.radius, player.radius)), // Circle center
        player.radius, // Use player's radius property
        o.pos || Vector(0, 0), // Rectangle top-left corner
        o.width!,
        o.height!
      )
    ) {
      if (o.type == GameObjectType.Platform) {
        resolveCircleRectangleCollision(player, o as Box);
      } else if (o.type == GameObjectType.Ball) {
        resolveCircleRectangleCollision(player, o as Box);
      } else if (o.type == GameObjectType.Pickup) {
        (o as Pickup).collect();
      } else if (o.type == GameObjectType.Shuriken) {
        emit(GameEvent.kill);
      } else if (o.type == GameObjectType.Goal) {
        emit(GameEvent.goal);
      }
    }
  }
}
